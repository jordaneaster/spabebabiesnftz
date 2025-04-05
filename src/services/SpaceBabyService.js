import supabase from '../utils/supabaseConfig';
import TABLES from '../utils/supabaseSchema';

const API_URL = 'http://localhost:3001';

/**
 * Generate a Space Baby using the remote generator service
 * @param {Object} options - Configuration options
 * @param {Array} options.traits - Selected traits for the baby
 * @param {string} options.species - Species of the baby (optional)
 * @returns {Promise<Object>} - The generated Space Baby data
 */
export const generateRemoteSpaceBaby = async (options = {}) => {
  try {
    console.log('Generating space baby with options:', options);
    
    // Call the remote service for generating Space Babies
    const response = await fetch(`${API_URL}/generate-space-baby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        traits: options.traits || [],
        species: options.species || 'random',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to generate Space Baby: ${error}`);
    }

    const data = await response.json();
    console.log('Generated space baby:', data);
    return data;
  } catch (error) {
    console.error('Error generating space baby:', error);
    throw error;
  }
};

/**
 * Save a Space Baby to the database with proper authentication
 * @param {Object} spaceBaby - The Space Baby data to save
 * @param {Object} options - Additional options
 * @param {string} options.walletAddress - The wallet address of the owner
 * @returns {Promise<Object>} - The saved Space Baby data
 */
export const saveSpaceBabyToDb = async (spaceBaby, options = {}) => {
  try {
    console.log('Saving space baby to database:', spaceBaby);
    
    // Get the session to check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No authenticated session, attempting anonymous session');
      // Try to create an anonymous session
      const { data: { session: anonSession }, error: anonError } = await supabase.auth.signInAnonymously();
      
      if (anonError) {
        console.error('Error creating anonymous session:', anonError);
        throw new Error(`Authentication failed: ${anonError.message}`);
      }
      
      console.log('Anonymous session created');
    }
    
    // Get the user profile from space_baby_users
    const { data: userProfile, error: profileError } = await supabase
      .from('space_baby_users')
      .select('id')
      .eq('wallet_address', options.walletAddress)
      .single();
    
    // Handle errors but don't throw yet - we might need to create a profile
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError);
    }
    
    // If user profile doesn't exist, create one
    let userId;
    if (!userProfile) {
      console.log('Creating new user profile for wallet:', options.walletAddress);
      
      const { data: newUser, error: createError } = await supabase
        .from('space_baby_users')
        .insert([{ 
          wallet_address: options.walletAddress,
          wallet_type: 'phantom',
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (createError) {
        console.error('Error creating user profile:', createError);
        throw new Error(`Failed to create user profile: ${createError.message}`);
      }
      
      userId = newUser[0].id;
      console.log('Created new user profile with ID:', userId);
    } else {
      userId = userProfile.id;
      console.log('Found existing user profile with ID:', userId);
    }
    
    // Prepare Space Baby data for insertion
    const babyData = {
      user_id: userId,
      wallet_address: options.walletAddress,
      name: spaceBaby.name || 'Space Baby',
      image_url: spaceBaby.image || spaceBaby.imageUrl || '',
      metadata_uri: spaceBaby.metadata_uri || '',
      metadata_url: spaceBaby.metadata_url || '',
      attributes: spaceBaby.attributes || {},
      soul_generation_complete: true,
      created_at: spaceBaby.created_at || new Date().toISOString(),
      completed_at: new Date().toISOString(),
      transaction_hash: spaceBaby.transactionHash || options.transactionHash || ''
    };
    
    console.log('Inserting baby data:', babyData);
    
    // Try to insert the record
    const { data, error } = await supabase
      .from(TABLES.BABIES)
      .insert([babyData])
      .select();
    
    if (error) {
      console.error('Error saving space baby:', error);
      
      // Also save to local storage as a backup
      const savedBabies = JSON.parse(localStorage.getItem('spaceBabiesBackup') || '[]');
      savedBabies.push({
        ...babyData,
        savedAt: new Date().toISOString(),
        error: error.message
      });
      localStorage.setItem('spaceBabiesBackup', JSON.stringify(savedBabies));
      
      throw error;
    }
    
    console.log('Space baby saved successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Error in saveSpaceBabyToDb:', error);
    throw error;
  }
};

/**
 * Call the remote service to mint a Space Baby NFT
 * @param {Object} data - Information needed for minting
 * @returns {Promise<Object>} - Minting result
 */
export const mintRemoteSpaceBaby = async (data) => {
  try {
    const response = await fetch(`${API_URL}/mint-space-baby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to mint Space Baby: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error minting space baby:', error);
    throw error;
  }
};

export default {
  generateRemoteSpaceBaby,
  saveSpaceBabyToDb,
  mintRemoteSpaceBaby
};
