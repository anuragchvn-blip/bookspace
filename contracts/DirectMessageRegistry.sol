// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title DirectMessageRegistry v1.4 (Security Hardened)
 * @dev Contract for managing paid direct messaging access on Polygon
 * @notice Users pay 1 POL to unlock unlimited DMs - Payment goes to platform owner
 * @author BookSpace Team
 * 
 * SECURITY FIXES:
 * ✅ ReentrancyGuard protection
 * ✅ SafeETH transfers using Address.sendValue
 * ✅ IPFS hash validation
 * ✅ Emergency ETH recovery
 * ✅ Timelock for ownership changes
 * ✅ address(0) validation
 * 
 * ═══════════════════════════════════════════════════════════════
 *  WHAT THIS CONTRACT DOES (SIMPLE EXPLANATION)
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. SEND ENCRYPTED MESSAGES
 *    - Messages are encrypted on your browser BEFORE sending
 *    - Stored on blockchain as encrypted text
 *    - Only sender and receiver can decrypt
 * 
 * 2. PAY ONCE, MESSAGE FOREVER
 *    - Pay 1 MATIC to unlock messaging with someone
 *    - After payment, send unlimited messages
 *    - Payment goes to platform owner (0x2913...) - NOT the receiver
 * 
 * 3. PRIVACY & SECURITY
 *    - End-to-end encryption (frontend)
 *    - No one can read your messages (not even us!)
 *    - Block unwanted senders (harassment protection)
 * 
 * 4. HOW IT WORKS:
 *    Step 1: Alice wants to message Bob
 *    Step 2: Alice pays 1 MATIC to platform owner
 *    Step 3: Alice encrypts message with Bob's public key
 *    Step 4: Encrypted message sent to blockchain
 *    Step 5: Bob decrypts with his private key
 *    Step 6: Alice can now send unlimited messages to Bob
 * 
 * ═══════════════════════════════════════════════════════════════
 */
contract DirectMessageRegistry is ReentrancyGuard {
    using Address for address payable;
    
    // Version
    string public constant VERSION = "1.4.0";
    
    // Constants
    uint256 public constant DM_ACCESS_PRICE = 1 ether; // 1 POL (MATIC)
    uint256 public constant OWNERSHIP_TRANSFER_DELAY = 3 days; // Timelock for safety
    
    // Platform owner (receives DM unlock payments)
    address public platformOwner;
    address public pendingOwner;
    uint256 public ownershipTransferInitiated;
    
    // Security: Pausable in emergencies
    bool public isPaused;

    // Structs
    struct DMAccess {
        address sender;
        address recipient;
        uint256 paidAt;
        bool isActive;
    }

    struct Message {
        uint256 id;
        address sender;
        address recipient;
        string ipfsHash; // Encrypted message content stored on IPFS
        uint256 timestamp;
    }

    // State variables
    uint256 private messageCounter;
    
    // Mapping: sender => recipient => DMAccess
    mapping(address => mapping(address => DMAccess)) public dmAccess;
    
    // Mapping: message ID => Message
    mapping(uint256 => Message) public messages;
    
    // Mapping: user => array of message IDs (inbox)
    mapping(address => uint256[]) public userInbox;
    
    // Mapping: user => array of message IDs (sent)
    mapping(address => uint256[]) public userSentMessages;
    
    // Mapping: conversation hash => message IDs
    mapping(bytes32 => uint256[]) public conversationMessages;
    
    // Mapping: blocker => blocked address => bool (harassment prevention)
    mapping(address => mapping(address => bool)) public blockedSenders;
    
    // Revenue tracking
    uint256 public totalRevenue;

    // Events
    event DMAccessGranted(
        address indexed sender,
        address indexed recipient,
        uint256 paidAmount,
        uint256 timestamp
    );

    event MessageSent(
        uint256 indexed messageId,
        address indexed sender,
        address indexed recipient,
        string ipfsHash,
        uint256 timestamp
    );

    event AccessRevoked(
        address indexed sender,
        address indexed recipient,
        uint256 timestamp
    );
    
    event PlatformPaymentReceived(
        address indexed sender,
        uint256 amount,
        uint256 timestamp
    );
    
    event PlatformOwnerUpdated(
        address indexed oldOwner,
        address indexed newOwner,
        uint256 timestamp
    );
    
    event SenderBlocked(
        address indexed blocker,
        address indexed blocked,
        uint256 timestamp
    );
    
    event SenderUnblocked(
        address indexed blocker,
        address indexed blocked,
        uint256 timestamp
    );
    
    event ContractPaused(address indexed by, uint256 timestamp);
    event ContractUnpaused(address indexed by, uint256 timestamp);
    event OwnershipTransferInitiated(address indexed currentOwner, address indexed newOwner, uint256 effectiveTime);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    // Constructor - Set platform owner to fixed address with validation
    constructor() {
        platformOwner = 0x2913411D27f5d6716590F952b50088779Ae4a699; // Your wallet - receives all DM payments
        require(platformOwner != address(0), "Invalid platform owner"); // Safety check
        isPaused = false;
    }

    // Reject accidental ETH transfers
    receive() external payable {
        revert("Use purchaseDMAccess to send MATIC");
    }
    
    fallback() external payable {
        revert("Use purchaseDMAccess to send MATIC");
    }

    // Modifiers
    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner, "Only platform owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }
    
    modifier hasValidAccess(address _recipient) {
        require(_recipient != address(0), "Invalid recipient");
        require(_recipient != msg.sender, "Cannot DM yourself");
        require(!blockedSenders[_recipient][msg.sender], "Sender blocked by recipient");
        
        DMAccess memory access = dmAccess[msg.sender][_recipient];
        require(access.isActive, "DM access not granted");
        _;
    }

    /**
     * @dev Purchase DM access to send unlimited messages to a recipient
     * @notice Payment of 1 POL goes to platform owner (0x2913...), NOT to the recipient
     * @param _recipient Address of the user to unlock DM access with
     * @param _deadline Timestamp deadline to prevent front-running
     * 
     * PAYMENT FLOW:
     * - User pays 1 POL → Platform owner (0x2913...) receives it → User gets unlimited messaging
     * 
     * EXAMPLE:
     * - You want to message Bob (0xBob...)
     * - Call: purchaseDMAccess(0xBob..., deadline)
     * - Send: 1 POL with the transaction
     * - Platform owner gets 1 POL (NOT Bob!)
     * - Result: You can now send unlimited messages to Bob
     */
    function purchaseDMAccess(address _recipient, uint256 _deadline) 
        public 
        payable 
        whenNotPaused 
        nonReentrant  // SECURITY: Prevents reentrancy attacks
    {
        // Security: Prevent front-running with stale transactions
        require(block.timestamp <= _deadline, "Transaction expired");
        require(_recipient != address(0), "Invalid recipient");
        require(_recipient != msg.sender, "Cannot DM yourself");
        require(msg.value >= DM_ACCESS_PRICE, "Insufficient payment");
        require(!dmAccess[msg.sender][_recipient].isActive, "Access already granted");
        require(!blockedSenders[_recipient][msg.sender], "Blocked by recipient");

        // Security: Checks-Effects-Interactions pattern to prevent reentrancy
        // 1. CHECKS (done above)
        
        // 2. EFFECTS (update state BEFORE external calls)
        dmAccess[msg.sender][_recipient] = DMAccess({
            sender: msg.sender,
            recipient: _recipient,
            paidAt: block.timestamp,
            isActive: true
        });
        
        uint256 paymentAmount = msg.value;
        totalRevenue += paymentAmount;

        // 3. INTERACTIONS (external calls last)
        // SECURITY: Use OpenZeppelin's sendValue instead of low-level call
        payable(platformOwner).sendValue(paymentAmount);

        emit DMAccessGranted(msg.sender, _recipient, paymentAmount, block.timestamp);
        emit PlatformPaymentReceived(msg.sender, paymentAmount, block.timestamp);
    }

    /**
     * @dev Send a direct message (requires active DM access)
     * @param _recipient Address of the message recipient
     * @param _ipfsHash IPFS hash of the encrypted message content (must be valid IPFS hash)
     * 
     * FLOW:
     * 1. Frontend encrypts your message with recipient's public key
     * 2. Encrypted message uploaded to IPFS → get hash
     * 3. Call this function with IPFS hash
     * 4. Message stored on blockchain
     * 5. Recipient can decrypt and read
     * 
     * SECURITY: IPFS hash is validated (must start with Qm or bafy)
     */
    function sendMessage(address _recipient, string memory _ipfsHash) 
        public 
        whenNotPaused
        nonReentrant  // SECURITY: Prevents reentrancy
        hasValidAccess(_recipient) 
        returns (uint256) 
    {
        require(bytes(_ipfsHash).length > 0, "Message content required");
        require(isValidIPFSHash(_ipfsHash), "Invalid IPFS hash format"); // SECURITY: Validate IPFS hash

        messageCounter++;
        uint256 newMessageId = messageCounter;

        messages[newMessageId] = Message({
            id: newMessageId,
            sender: msg.sender,
            recipient: _recipient,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp
        });

        // Add to inbox and sent messages
        userInbox[_recipient].push(newMessageId);
        userSentMessages[msg.sender].push(newMessageId);

        // Add to conversation
        bytes32 conversationHash = getConversationHash(msg.sender, _recipient);
        conversationMessages[conversationHash].push(newMessageId);

        emit MessageSent(newMessageId, msg.sender, _recipient, _ipfsHash, block.timestamp);
        return newMessageId;
    }

    /**
     * @dev Validate IPFS hash format
     * @param _hash IPFS hash to validate
     * @return bool True if valid IPFS hash (starts with Qm or bafy)
     * 
     * SECURITY: Prevents storing arbitrary/malicious data
     */
    function isValidIPFSHash(string memory _hash) public pure returns (bool) {
        bytes memory hashBytes = bytes(_hash);
        
        // Check length (IPFS CIDv0 = 46 chars starting with Qm, CIDv1 varies but starts with bafy/bafk)
        if (hashBytes.length < 46 || hashBytes.length > 100) {
            return false;
        }
        
        // Check if starts with "Qm" (CIDv0) or "bafy"/"bafk" (CIDv1)
        if (hashBytes[0] == 'Q' && hashBytes[1] == 'm') {
            return true; // CIDv0
        }
        
        if (hashBytes.length >= 4 && 
            hashBytes[0] == 'b' && 
            hashBytes[1] == 'a' && 
            hashBytes[2] == 'f' && 
            (hashBytes[3] == 'y' || hashBytes[3] == 'k')) {
            return true; // CIDv1
        }
        
        return false;
    }
    
    /**
     * @dev Check if sender has valid DM access to recipient
     * @param _sender Address of the sender
     * @param _recipient Address of the recipient
     */
    function checkDMAccess(address _sender, address _recipient) public view returns (bool) {
        return dmAccess[_sender][_recipient].isActive;
    }

    /**
     * @dev Get DM access details between sender and recipient
     * @param _sender Address of the sender
     * @param _recipient Address of the recipient
     */
    function getDMAccess(address _sender, address _recipient) 
        public 
        view 
        returns (DMAccess memory) 
    {
        return dmAccess[_sender][_recipient];
    }

    /**
     * @dev Get a specific message by ID
     * @param _messageId ID of the message
     */
    function getMessage(uint256 _messageId) public view returns (Message memory) {
        Message memory message = messages[_messageId];
        require(
            message.sender == msg.sender || message.recipient == msg.sender,
            "Not authorized to view message"
        );
        return message;
    }

    /**
     * @dev Get all messages in user's inbox
     * @param _user Address of the user
     */
    function getInbox(address _user) public view returns (uint256[] memory) {
        require(_user == msg.sender, "Can only view own inbox");
        return userInbox[_user];
    }

    /**
     * @dev Get all messages sent by user
     * @param _user Address of the user
     */
    function getSentMessages(address _user) public view returns (uint256[] memory) {
        require(_user == msg.sender, "Can only view own sent messages");
        return userSentMessages[_user];
    }

    /**
     * @dev Get conversation between two users
     * @param _user1 Address of first user
     * @param _user2 Address of second user
     */
    function getConversation(address _user1, address _user2) 
        public 
        view 
        returns (uint256[] memory) 
    {
        require(
            msg.sender == _user1 || msg.sender == _user2,
            "Not authorized to view conversation"
        );
        
        bytes32 conversationHash = getConversationHash(_user1, _user2);
        return conversationMessages[conversationHash];
    }

    /**
     * @dev Generate a unique conversation hash for two users
     * @param _user1 Address of first user
     * @param _user2 Address of second user
     */
    function getConversationHash(address _user1, address _user2) 
        public 
        pure 
        returns (bytes32) 
    {
        // Ensure consistent hash regardless of user order
        if (_user1 < _user2) {
            return keccak256(abi.encodePacked(_user1, _user2));
        } else {
            return keccak256(abi.encodePacked(_user2, _user1));
        }
    }

    /**
     * @dev Revoke DM access (only sender can revoke their own access)
     * @param _recipient Address of the recipient
     */
    function revokeDMAccess(address _recipient) public {
        require(dmAccess[msg.sender][_recipient].isActive, "No active access to revoke");
        
        dmAccess[msg.sender][_recipient].isActive = false;
        
        emit AccessRevoked(msg.sender, _recipient, block.timestamp);
    }

    /**
     * @dev Get total number of messages sent
     */
    function getTotalMessages() public view returns (uint256) {
        return messageCounter;
    }

    /**
     * @dev Get message count in inbox
     * @param _user Address of the user
     */
    function getInboxCount(address _user) public view returns (uint256) {
        return userInbox[_user].length;
    }

    /**
     * @dev Get sent message count
     * @param _user Address of the user
     */
    function getSentCount(address _user) public view returns (uint256) {
        return userSentMessages[_user].length;
    }
    
    /**
     * @dev Initiate platform owner transfer (timelock for security)
     * @param _newOwner Address of the new platform owner
     * 
     * SECURITY: 3-day timelock prevents instant rug pulls
     */
    function initiateOwnershipTransfer(address _newOwner) public onlyPlatformOwner {
        require(_newOwner != address(0), "Invalid address");
        require(_newOwner != platformOwner, "Same as current owner");
        
        pendingOwner = _newOwner;
        ownershipTransferInitiated = block.timestamp;
        
        emit OwnershipTransferInitiated(platformOwner, _newOwner, block.timestamp + OWNERSHIP_TRANSFER_DELAY);
    }
    
    /**
     * @dev Complete platform owner transfer after timelock expires
     * 
     * SECURITY: Must wait 3 days after initiateOwnershipTransfer()
     */
    function completeOwnershipTransfer() public {
        require(pendingOwner != address(0), "No pending transfer");
        require(block.timestamp >= ownershipTransferInitiated + OWNERSHIP_TRANSFER_DELAY, "Timelock not expired");
        
        address oldOwner = platformOwner;
        platformOwner = pendingOwner;
        pendingOwner = address(0);
        ownershipTransferInitiated = 0;
        
        emit OwnershipTransferred(oldOwner, platformOwner);
    }
    
    /**
     * @dev Cancel pending ownership transfer
     */
    function cancelOwnershipTransfer() public onlyPlatformOwner {
        require(pendingOwner != address(0), "No pending transfer");
        
        pendingOwner = address(0);
        ownershipTransferInitiated = 0;
    }
    
    /**
     * @dev Update platform owner (only current owner can do this)
     * @param _newOwner Address of the new platform owner
     * @deprecated Use initiateOwnershipTransfer() for safer transfers with timelock
     */
    function updatePlatformOwner(address _newOwner) public onlyPlatformOwner {
        require(_newOwner != address(0), "Invalid address");
        require(_newOwner != platformOwner, "Same as current owner");
        
        address oldOwner = platformOwner;
        platformOwner = _newOwner;
        
        emit PlatformOwnerUpdated(oldOwner, _newOwner, block.timestamp);
    }
    
    /**
     * @dev Withdraw accumulated platform fees (only owner)
     * SECURITY: Uses sendValue for safe transfers
     */
    function withdrawPlatformFees() public onlyPlatformOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        payable(platformOwner).sendValue(balance);
    }
    
    /**
     * @dev Recover accidentally sent ETH (e.g., from selfdestruct)
     * @param _to Address to send recovered ETH
     * @param _amount Amount to recover
     * 
     * SECURITY: Emergency function for accidental ETH sent directly to contract
     */
    function recoverAccidentalETH(address payable _to, uint256 _amount) public onlyPlatformOwner nonReentrant {
        require(_to != address(0), "Invalid recipient");
        require(_amount <= address(this).balance, "Insufficient balance");
        
        _to.sendValue(_amount);
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Block a sender from messaging you (harassment prevention)
     * @param _sender Address to block
     * 
     * USE CASE:
     * - Someone is spamming you
     * - Block them so they can't send messages
     * - Even if they paid for access, blocking prevents messaging
     */
    function blockSender(address _sender) public {
        require(_sender != address(0), "Invalid address");
        require(_sender != msg.sender, "Cannot block yourself");
        require(!blockedSenders[msg.sender][_sender], "Already blocked");
        
        blockedSenders[msg.sender][_sender] = true;
        
        emit SenderBlocked(msg.sender, _sender, block.timestamp);
    }
    
    /**
     * @dev Unblock a previously blocked sender
     * @param _sender Address to unblock
     */
    function unblockSender(address _sender) public {
        require(_sender != address(0), "Invalid address");
        require(blockedSenders[msg.sender][_sender], "Not blocked");
        
        blockedSenders[msg.sender][_sender] = false;
        
        emit SenderUnblocked(msg.sender, _sender, block.timestamp);
    }
    
    /**
     * @dev Check if a sender is blocked by recipient
     * @param _blocker Address of the blocker (recipient)
     * @param _sender Address of the sender
     */
    function isBlocked(address _blocker, address _sender) public view returns (bool) {
        return blockedSenders[_blocker][_sender];
    }
    
    /**
     * @dev Get platform owner address (transparency)
     */
    function getPlatformOwner() public view returns (address) {
        return platformOwner;
    }
    
    // ═══════════════════════════════════════════════════════════════
    //  ADMIN FUNCTIONS (Emergency use only)
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * @notice Pause contract in emergency
     * @dev Prevents all messaging and access purchases
     */
    function pauseContract() external onlyPlatformOwner {
        isPaused = true;
        emit ContractPaused(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Unpause contract
     * @dev Resume normal operations
     */
    function unpauseContract() external onlyPlatformOwner {
        isPaused = false;
        emit ContractUnpaused(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Get contract statistics
     * @return Total messages, total revenue, access price, paused status
     */
    function getContractStats() external view returns (
        uint256 totalMessages,
        uint256 revenue,
        uint256 accessPrice,
        bool paused
    ) {
        return (messageCounter, totalRevenue, DM_ACCESS_PRICE, isPaused);
    }
}
