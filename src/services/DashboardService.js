import supabase from '../utils/supabaseConfig';
import TABLES from '../utils/supabaseSchema';

/**
 * Service for handling dashboard-related data operations
 */
class DashboardService {
  /**
   * Fetch a user's NFT collection
   */
  static async fetchUserNFTs(walletAddress) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NFTS)
        .select(`
          *,
          nft_attributes(*)
        `)
        .eq('owner_address', walletAddress);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }
  
  /**
   * Fetch level data for an NFT
   */
  static async fetchNFTLevel(nftId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.LEVELS)
        .select('*')
        .eq('nft_id', nftId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data || { current_level: 1, experience_points: 0 };
    } catch (error) {
      console.error('Error fetching NFT level:', error);
      return { current_level: 1, experience_points: 0 };
    }
  }
  
  /**
   * Fetch active governance proposals
   */
  static async fetchActiveProposals(limit = 5) {
    try {
      const { data, error } = await supabase
        .from(TABLES.GOVERNANCE)
        .select('*')
        .in('status', ['proposed', 'active'])
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active proposals:', error);
      return [];
    }
  }
  
  /**
   * Get user's voting history
   */
  static async fetchUserVotes(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.VOTES)
        .select(`
          *,
          governance_proposals(title, description, status)
        `)
        .eq('user_id', userId)
        .order('voted_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user votes:', error);
      return [];
    }
  }
  
  /**
   * Cast a vote on a proposal
   */
  static async castVote(userId, proposalId, voteChoice) {
    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from(TABLES.VOTES)
        .select('id')
        .match({ user_id: userId, proposal_id: proposalId })
        .single();
      
      if (existingVote) {
        // Update existing vote
        const { data, error } = await supabase
          .from(TABLES.VOTES)
          .update({ vote: voteChoice, voted_at: new Date() })
          .eq('id', existingVote.id)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Create new vote
        const { data, error } = await supabase
          .from(TABLES.VOTES)
          .insert([{
            user_id: userId,
            proposal_id: proposalId,
            vote: voteChoice,
            voted_at: new Date()
          }])
          .select();
          
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }
  
  /**
   * Fetch guardian benefits
   */
  static async fetchGuardianBenefits(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.BENEFITS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching guardian benefits:', error);
      return [];
    }
  }
  
  /**
   * Fetch user activity
   */
  static async fetchUserActivity(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ACTIVITIES)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }
  }
  
  /**
   * Log activity
   */
  static async logActivity(userId, activityType, description, metadata = {}) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ACTIVITIES)
        .insert([{
          user_id: userId,
          activity_type: activityType,
          description,
          metadata,
          created_at: new Date()
        }]);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging activity:', error);
      return null;
    }
  }
  
  /**
   * Fetch community initiatives
   */
  static async fetchCommunityInitiatives() {
    try {
      const { data, error } = await supabase
        .from(TABLES.INITIATIVES)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching community initiatives:', error);
      return [];
    }
  }
}

export default DashboardService;
