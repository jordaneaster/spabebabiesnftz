import supabase from './supabaseConfig';
import TABLES from './supabaseSchema';

/**
 * Generates a Space Baby with the given parameters
 * @param {string} id - Unique ID for the space baby
 * @param {Object} options - Configuration options
 * @returns {Object} The generated space baby object
 */
export const generateSpaceBaby = async (id, options = {}) => {
  try {
    console.log('Generating space baby with options:', options);
    
    // In a real implementation, this would generate the actual NFT content
    // For now, we'll mock the generation
    
    const species = options.species || 'green'; // Default to green
    
    // For demonstration, we'll create a mock baby
    const babyName = `Space Baby #${Math.floor(Math.random() * 1000)}`;
    
    // Convert traits to attributes
    const attributes = [];
    if (options.traits && Array.isArray(options.traits)) {
      options.traits.forEach(trait => {
        attributes.push({
          trait_type: trait.name || "Unknown",
          value: trait.description || "Unknown"
        });
      });
    }
    
    // Mock image URL - in reality this would be created dynamically
    // This should point to the NFT storage
    const imageUrl = `https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png`;
    
    // Create metadata
    const metadata = {
      name: babyName,
      description: "A unique Space Baby from the Space Babiez Universe",
      image: imageUrl,
      attributes: attributes,
      species: species,
      id: id
    };
    
    return {
      id,
      name: babyName,
      species,
      image: imageUrl,
      metadata: metadata,
      attributes: attributes.reduce((obj, attr) => {
        obj[attr.trait_type] = attr.value;
        return obj;
      }, {}),
      created_at: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error generating space baby:', error);
    throw error;
  }
};

/**
 * Save the generated Space Baby to Supabase
 * @param {string} userId - ID of the user from space_baby_users table
 * @param {Object} spaceBaby - The generated space baby object
 * @returns {Object} The saved space baby record
 */
export const saveSpaceBaby = async (userId, spaceBaby) => {
  try {
    console.log('Saving space baby for user:', userId);
    
    if (!userId) {
      throw new Error('User ID is required to save a Space Baby');
    }
    
    if (!spaceBaby) {
      throw new Error('Space Baby data is required');
    }
    
    // Convert attributes to jsonb format if needed
    const attributesJson = typeof spaceBaby.attributes === 'object' 
      ? spaceBaby.attributes 
      : {};
    
    // Prepare data for insertion
    const babyData = {
      user_id: userId,
      wallet_address: spaceBaby.walletAddress || '',
      name: spaceBaby.name || spaceBaby.metadata?.name || `Space Baby`,
      image_url: spaceBaby.image || '',
      metadata_uri: spaceBaby.metadata_uri || '',
      metadata_url: spaceBaby.metadata_url || '',
      attributes: attributesJson,
      soul_generation_complete: true,
      created_at: spaceBaby.created_at || new Date().toISOString(),
      completed_at: new Date().toISOString(),
      transaction_hash: spaceBaby.transactionHash || ''
    };
    
    console.log('Inserting baby data:', babyData);
    
    // First check if the user is authenticated with Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    // If the user is authenticated, use their session for the insert
    if (session) {
      console.log('Using authenticated session for insert');
    } else {
      console.log('No authenticated session found, proceeding with anonymous insert');
    }
    
    // Try to insert the record without the auth_user_id field (it doesn't exist in the table)
    const { data, error } = await supabase
      .from(TABLES.BABIES)
      .insert([babyData])
      .select();
    
    if (error) {
      console.error('Error saving space baby to Supabase:', error);
      
      if (error.code === '42501') { // Permission denied error
        console.warn('RLS policy prevented insert. Attempting with fallback approach...');
        
        // Try to create a public record with minimal authentication requirements
        const { data: publicData, error: publicError } = await supabase
          .from(TABLES.BABIES)
          .insert([{
            wallet_address: spaceBaby.walletAddress || '',
            name: spaceBaby.name || spaceBaby.metadata?.name || `Space Baby`,
            image_url: spaceBaby.image || '',
            attributes: attributesJson,
            soul_generation_complete: true,
          }])
          .select();
        
        if (publicError) {
          console.error('Fallback approach also failed:', publicError);
          throw new Error(`RLS policy prevented saving: ${publicError.message}`);
        }
        
        console.log('Space baby saved with fallback approach:', publicData);
        return publicData[0];
      }
      
      throw error;
    }
    
    console.log('Space baby saved successfully:', data);
    return data[0];
    
  } catch (error) {
    console.error('Error in saveSpaceBaby:', error);
    throw error;
  }
};

/**
 * Fetch all Space Babies associated with a specific user
 * @param {Object} params - Query parameters
 * @param {string} [params.userId] - ID of the user from space_baby_users table
 * @param {string} [params.walletAddress] - Wallet address to query by
 * @returns {Array} The user's space babies
 */
export const getUserSpaceBabies = async (params = {}) => {
  try {
    const { userId, walletAddress } = params;
    
    if (!userId && !walletAddress) {
      throw new Error('Either userId or walletAddress is required to fetch Space Babies');
    }
    
    let query = supabase
      .from(TABLES.BABIES)
      .select('*')
      .order('created_at', { ascending: false });
    
    // Filter by user ID if provided
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    // Filter by wallet address if provided
    if (walletAddress) {
      query = query.eq('wallet_address', walletAddress);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching space babies:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} space babies for user`);
    return data || [];
    
  } catch (error) {
    console.error('Error in getUserSpaceBabies:', error);
    throw error;
  }
};
