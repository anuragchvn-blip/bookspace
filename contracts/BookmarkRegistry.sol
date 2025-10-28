// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BookmarkRegistry v1.2
 * @dev Decentralized bookmark and space management system
 * @notice Store bookmarks on-chain with IPFS integration
 * @author BookSpace Team
 * 
 * WHAT THIS CONTRACT DOES:
 * 1. CREATE SPACES - Organize bookmarks into public/private spaces
 * 2. SAVE BOOKMARKS - Store URLs with metadata on blockchain + IPFS
 * 3. ACCESS CONTROL - Public spaces (free) or Private spaces (paid access)
 * 4. MONETIZATION - Space owners earn when users join private spaces
 */
contract BookmarkRegistry {
    // Version
    string public constant VERSION = "1.2.0";
    
    // Security: Owner can pause contract in emergencies
    address public contractOwner;
    bool public isPaused;
    
    // Structs
    struct Bookmark {
        uint256 id;
        string url;
        string title;
        string description;
        string[] tags;
        address owner;
        uint256 spaceId;
        uint256 timestamp;
        string ipfsHash;
        bool isDeleted;
    }

    struct Space {
        uint256 id;
        string name;
        string description;
        address owner;
        bool isPublic;
        uint256 accessPrice; // in wei (MATIC)
        uint256 memberCount;
        uint256 createdAt;
        bool isActive;
    }

    // State variables
    uint256 private bookmarkCounter;
    uint256 private spaceCounter;
    
    mapping(uint256 => Bookmark) public bookmarks;
    mapping(uint256 => Space) public spaces;
    mapping(uint256 => mapping(address => bool)) public spaceMembers;
    mapping(address => uint256[]) public userBookmarks;
    mapping(address => uint256[]) public userSpaces;
    mapping(uint256 => uint256[]) public spaceBookmarks;
    
    // Security: Track total fees collected (for transparency)
    uint256 public totalFeesCollected;
    
    // Constructor: Set contract deployer as owner
    constructor() {
        contractOwner = msg.sender;
        isPaused = false;
    }
    
    // Events
    event BookmarkCreated(
        uint256 indexed id,
        address indexed owner,
        uint256 indexed spaceId,
        string url,
        uint256 timestamp
    );
    
    event BookmarkUpdated(
        uint256 indexed id,
        string url,
        string title,
        uint256 timestamp
    );
    
    event BookmarkDeleted(uint256 indexed id, address indexed owner);
    
    event SpaceCreated(
        uint256 indexed id,
        address indexed owner,
        string name,
        bool isPublic,
        uint256 accessPrice
    );
    
    event SpaceJoined(
        uint256 indexed spaceId,
        address indexed member,
        uint256 paidAmount
    );
    
    event SpaceUpdated(
        uint256 indexed id,
        string name,
        string description,
        uint256 accessPrice
    );
    
    event ContractPaused(address indexed by, uint256 timestamp);
    event ContractUnpaused(address indexed by, uint256 timestamp);

    // Modifiers
    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }
    modifier onlyBookmarkOwner(uint256 _bookmarkId) {
        require(bookmarks[_bookmarkId].owner == msg.sender, "Not bookmark owner");
        require(!bookmarks[_bookmarkId].isDeleted, "Bookmark deleted");
        _;
    }

    modifier onlySpaceOwner(uint256 _spaceId) {
        require(spaces[_spaceId].owner == msg.sender, "Not space owner");
        require(spaces[_spaceId].isActive, "Space not active");
        _;
    }

    modifier hasSpaceAccess(uint256 _spaceId) {
        Space memory space = spaces[_spaceId];
        require(space.isActive, "Space not active");
        require(
            space.isPublic || 
            space.owner == msg.sender || 
            spaceMembers[_spaceId][msg.sender],
            "No access to space"
        );
        _;
    }

    // Bookmark functions
    /**
     * @notice Create a new bookmark in a space
     * @dev Saves bookmark metadata on-chain and IPFS hash
     * @param _url The URL to bookmark (required)
     * @param _title Title of the bookmark
     * @param _description Description of the bookmark
     * @param _tags Array of tags (max 10)
     * @param _spaceId ID of the space to save bookmark in
     * @param _ipfsHash IPFS hash where full metadata is stored
     * @return uint256 The new bookmark ID
     */
    function createBookmark(
        string memory _url,
        string memory _title,
        string memory _description,
        string[] memory _tags,
        uint256 _spaceId,
        string memory _ipfsHash
    ) public whenNotPaused returns (uint256) {
        require(bytes(_url).length > 0, "URL required");
        require(_tags.length <= 10, "Max 10 tags"); // Security: Prevent gas spam
        require(spaces[_spaceId].isActive, "Invalid space");
        require(
            spaces[_spaceId].owner == msg.sender || 
            spaceMembers[_spaceId][msg.sender],
            "No access to space"
        );

        bookmarkCounter++;
        uint256 newBookmarkId = bookmarkCounter;

        bookmarks[newBookmarkId] = Bookmark({
            id: newBookmarkId,
            url: _url,
            title: _title,
            description: _description,
            tags: _tags,
            owner: msg.sender,
            spaceId: _spaceId,
            timestamp: block.timestamp,
            ipfsHash: _ipfsHash,
            isDeleted: false
        });

        userBookmarks[msg.sender].push(newBookmarkId);
        spaceBookmarks[_spaceId].push(newBookmarkId);

        emit BookmarkCreated(newBookmarkId, msg.sender, _spaceId, _url, block.timestamp);
        return newBookmarkId;
    }

    /**
     * @notice Update an existing bookmark
     * @dev Only bookmark owner can update
     */
    function updateBookmark(
        uint256 _bookmarkId,
        string memory _url,
        string memory _title,
        string memory _description,
        string[] memory _tags,
        string memory _ipfsHash
    ) public whenNotPaused onlyBookmarkOwner(_bookmarkId) {
        require(_tags.length <= 10, "Max 10 tags"); // Security: Prevent gas spam
        
        Bookmark storage bookmark = bookmarks[_bookmarkId];
        
        bookmark.url = _url;
        bookmark.title = _title;
        bookmark.description = _description;
        bookmark.tags = _tags;
        bookmark.ipfsHash = _ipfsHash;

        emit BookmarkUpdated(_bookmarkId, _url, _title, block.timestamp);
    }

    /**
     * @notice Soft delete a bookmark
     * @dev Bookmark remains on-chain but marked as deleted
     */
    function deleteBookmark(uint256 _bookmarkId) public whenNotPaused onlyBookmarkOwner(_bookmarkId) {
        bookmarks[_bookmarkId].isDeleted = true;
        emit BookmarkDeleted(_bookmarkId, msg.sender);
    }

    function getBookmark(uint256 _bookmarkId) public view returns (Bookmark memory) {
        require(!bookmarks[_bookmarkId].isDeleted, "Bookmark deleted");
        return bookmarks[_bookmarkId];
    }

    function getUserBookmarks(address _user) public view returns (uint256[] memory) {
        return userBookmarks[_user];
    }

    // Space functions
    /**
     * @notice Create a new space
     * @dev Space creator becomes owner and first member
     * @param _name Name of the space (required)
     * @param _description Description of the space
     * @param _isPublic True for public (free), False for private (paid)
     * @param _accessPrice Price to join (in wei/MATIC) - only for private spaces
     * @return uint256 The new space ID
     * 
     * EXAMPLE:
     * - Public space: createSpace("Web3 Resources", "Cool links", true, 0)
     * - Private space: createSpace("Premium Tools", "Paid links", false, 1000000000000000000) // 1 MATIC
     */
    function createSpace(
        string memory _name,
        string memory _description,
        bool _isPublic,
        uint256 _accessPrice
    ) public whenNotPaused returns (uint256) {
        require(bytes(_name).length > 0, "Name required");

        spaceCounter++;
        uint256 newSpaceId = spaceCounter;

        spaces[newSpaceId] = Space({
            id: newSpaceId,
            name: _name,
            description: _description,
            owner: msg.sender,
            isPublic: _isPublic,
            accessPrice: _accessPrice,
            memberCount: 1,
            createdAt: block.timestamp,
            isActive: true
        });

        spaceMembers[newSpaceId][msg.sender] = true;
        userSpaces[msg.sender].push(newSpaceId);

        emit SpaceCreated(newSpaceId, msg.sender, _name, _isPublic, _accessPrice);
        return newSpaceId;
    }

    /**
     * @notice Join a space (pay fee if private)
     * @dev Uses Checks-Effects-Interactions pattern to prevent reentrancy attacks
     * @param _spaceId ID of space to join
     * @param _deadline Unix timestamp - transaction must execute before this time
     * 
     * HOW IT WORKS:
     * 1. Public space: Just join, no payment needed
     * 2. Private space: Send MATIC >= accessPrice
     * 3. Payment goes directly to space owner
     * 4. You become a member and can create bookmarks
     * 
     * SECURITY:
     * - Deadline prevents front-running attacks
     * - Checks-Effects-Interactions prevents reentrancy
     * - State updated BEFORE external payment
     */
    function joinSpace(uint256 _spaceId, uint256 _deadline) public payable whenNotPaused {
        // Security: Prevent front-running with stale transactions
        require(block.timestamp <= _deadline, "Transaction expired");
        
        Space storage space = spaces[_spaceId];
        require(space.isActive, "Space not active");
        require(!spaceMembers[_spaceId][msg.sender], "Already a member");
        
        // Security: Checks-Effects-Interactions pattern to prevent reentrancy
        // 1. CHECKS (done above)
        
        // 2. EFFECTS (update state BEFORE external calls)
        spaceMembers[_spaceId][msg.sender] = true;
        space.memberCount++;
        uint256 paymentAmount = msg.value;
        
        // 3. INTERACTIONS (external calls last)
        if (!space.isPublic) {
            require(paymentAmount >= space.accessPrice, "Insufficient payment");
            
            totalFeesCollected += paymentAmount;
            
            // Transfer payment to space owner
            (bool success, ) = payable(space.owner).call{value: paymentAmount}("");
            require(success, "Payment failed");
        }

        emit SpaceJoined(_spaceId, msg.sender, paymentAmount);
    }

    /**
     * @notice Update space details
     * @dev Only space owner can update
     */
    function updateSpace(
        uint256 _spaceId,
        string memory _name,
        string memory _description,
        bool _isPublic,
        uint256 _accessPrice
    ) public whenNotPaused onlySpaceOwner(_spaceId) {
        Space storage space = spaces[_spaceId];
        
        space.name = _name;
        space.description = _description;
        space.isPublic = _isPublic;
        space.accessPrice = _accessPrice;

        emit SpaceUpdated(_spaceId, _name, _description, _accessPrice);
    }

    function getSpace(uint256 _spaceId) public view returns (Space memory) {
        require(spaces[_spaceId].isActive, "Space not active");
        return spaces[_spaceId];
    }

    function getSpaceBookmarks(uint256 _spaceId) 
        public 
        view 
        hasSpaceAccess(_spaceId) 
        returns (uint256[] memory) 
    {
        return spaceBookmarks[_spaceId];
    }

    function getUserSpaces(address _user) public view returns (uint256[] memory) {
        return userSpaces[_user];
    }

    function checkSpaceAccess(address _user, uint256 _spaceId) public view returns (bool) {
        Space memory space = spaces[_spaceId];
        return space.isActive && (
            space.isPublic || 
            space.owner == _user || 
            spaceMembers[_spaceId][_user]
        );
    }

    function isSpaceMember(uint256 _spaceId, address _user) public view returns (bool) {
        return spaceMembers[_spaceId][_user];
    }

    // Utility functions
    function getTotalBookmarks() public view returns (uint256) {
        return bookmarkCounter;
    }

    function getTotalSpaces() public view returns (uint256) {
        return spaceCounter;
    }
    
    // Admin functions (Emergency use only)
    /**
     * @notice Pause contract in case of emergency
     * @dev Only contract owner can pause
     */
    function pauseContract() external onlyContractOwner {
        isPaused = true;
        emit ContractPaused(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Unpause contract after emergency is resolved
     * @dev Only contract owner can unpause
     */
    function unpauseContract() external onlyContractOwner {
        isPaused = false;
        emit ContractUnpaused(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Transfer contract ownership
     * @dev Only current owner can transfer
     */
    function transferOwnership(address newOwner) external onlyContractOwner {
        require(newOwner != address(0), "Invalid address");
        contractOwner = newOwner;
    }
    
    /**
     * @notice Get contract statistics
     * @return Total bookmarks, total spaces, total fees collected, paused status
     */
    function getContractStats() external view returns (
        uint256 totalBookmarks,
        uint256 totalSpaces,
        uint256 feesCollected,
        bool paused
    ) {
        return (bookmarkCounter, spaceCounter, totalFeesCollected, isPaused);
    }
}
