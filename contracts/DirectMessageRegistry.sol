// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DirectMessageRegistry
 * @dev Contract for managing paid direct messaging access on Polygon
 * Users pay 1 POL to unlock unlimited DMs - Payment goes to platform owner
 */
contract DirectMessageRegistry {
    // Constants
    uint256 public constant DM_ACCESS_PRICE = 1 ether; // 1 POL (MATIC)
    
    // Platform owner (receives DM unlock payments)
    address public platformOwner;

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

    // Constructor - Set platform owner
    constructor() {
        platformOwner = msg.sender;
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
     * @notice Payment goes to platform owner, not the recipient
     * @param _recipient Address of the user to unlock DM access with
     * @param _deadline Timestamp deadline to prevent front-running
     */
    function purchaseDMAccess(address _recipient, uint256 _deadline) public payable {
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

        // 3. INTERACTIONS (external calls last)
        (bool success, ) = payable(platformOwner).call{value: paymentAmount}("");
        require(success, "Payment transfer failed");

        emit DMAccessGranted(msg.sender, _recipient, paymentAmount, block.timestamp);
        emit PlatformPaymentReceived(msg.sender, paymentAmount, block.timestamp);
    }

    /**
     * @dev Send a direct message (requires active DM access)
     * @param _recipient Address of the message recipient
     * @param _ipfsHash IPFS hash of the encrypted message content
     */
    function sendMessage(address _recipient, string memory _ipfsHash) 
        public 
        hasValidAccess(_recipient) 
        returns (uint256) 
    {
        require(bytes(_ipfsHash).length > 0, "Message content required");
        require(bytes(_ipfsHash).length <= 100, "IPFS hash too long"); // Basic validation

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
     * @dev Update platform owner (only current owner can do this)
     * @param _newOwner Address of the new platform owner
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
     */
    function withdrawPlatformFees() public onlyPlatformOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(platformOwner).call{value: balance}("");
        require(success, "Withdrawal failed");
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
}
