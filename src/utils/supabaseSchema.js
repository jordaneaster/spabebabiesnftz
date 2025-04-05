/**
 * Supabase schema definitions for Space Babiez Univerze
 * This file serves as documentation and reference for table structures
 */

const TABLES = {
  // Users/Guardians table
  USERS: 'space_baby_users',
  
  // Space Babies table - add this mapping
  BABIES: 'space_babies',
  
  // NFT data table - updated for space babies
  NFTS: 'nfts',
  
  // NFT attributes/traits - updated for space babies
  NFT_ATTRIBUTES: 'nft_attributes',
  
  // Level progression system
  LEVELS: 'levels',
  
  // Governance proposals
  GOVERNANCE: 'governance_proposals',
  
  // Voting records
  VOTES: 'votes',
  
  // Community treasury and funds
  COMMUNITY_FUNDS: 'community_funds',
  
  // Guardian benefits
  BENEFITS: 'guardian_benefits',
  
  // Community initiatives
  INITIATIVES: 'initiatives',
  
  // NFT staking records
  STAKING: 'staking',
  
  // Rewards for participation
  REWARDS: 'rewards',
  
  // Guardian activity logs
  ACTIVITIES: 'activities',
  
  // Galaxy-specific data
  GALAXIES: 'galaxies'
};

/**
 * Table schema definitions - useful for creating tables if needed
 */
const SCHEMA = {
  // NFT table schema
  [TABLES.NFTS]: {
    id: 'uuid primary key default uuid_generate_v4()',
    user_id: 'uuid references users(id)',
    nft_id: 'text not null',
    species: 'text not null',
    image_url: 'text',
    pixelated_image_url: 'text',
    metadata: 'jsonb',
    created_at: 'timestamptz default now()',
    updated_at: 'timestamptz default now()'
  },
  
  // NFT attributes table schema
  [TABLES.NFT_ATTRIBUTES]: {
    id: 'uuid primary key default uuid_generate_v4()',
    nft_id: 'uuid references nfts(id)',
    trait_type: 'text not null',
    value: 'text not null', 
    created_at: 'timestamptz default now()'
  },
  
  // Space babies schema
  [TABLES.BABIES]: {
    id: 'uuid primary key default uuid_generate_v4()',
    user_id: 'uuid references space_baby_users(id)',
    wallet_address: 'text not null',
    name: 'text',
    image_url: 'text',
    metadata_uri: 'text',
    metadata_url: 'text',
    attributes: 'jsonb',
    soul_generation_complete: 'boolean default false',
    created_at: 'timestamptz default now()',
    completed_at: 'timestamptz',
    transaction_hash: 'text'
  }
};

export default TABLES;
export { SCHEMA };
