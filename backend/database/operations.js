const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client for backend operations
const supabaseUrl = process.env.SUPABASE_URL || 'https://tfvmzwiwwqpsuhffymnk.supabase.co';
const supabaseKey = process.env.SUPA_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Incident Operations (Supabase integration)
const incidentOperations = {
  // Get incidents with optional resolved filter, ordered newest first
  async getIncidents(resolvedFilter = null) {
    try {
      let query = supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false }); // newest first

      // Apply resolved filter if provided
      if (resolvedFilter !== null) {
        const status = resolvedFilter ? 'resolved' : 'unresolved';
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Failed to get incidents: ${error.message}`);
    }
  },

  // Get incident by ID
  async getIncidentById(id) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Incident not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get incident: ${error.message}`);
    }
  },

  // Toggle incident resolved status and return updated row
  async toggleIncidentResolved(id) {
    try {
      // First get the current incident
      const incident = await this.getIncidentById(id);
      
      // Toggle the status
      const newStatus = incident.status === 'resolved' ? 'unresolved' : 'resolved';
      
      // Update the incident
      const { data, error } = await supabase
        .from('incidents')
        .update({ 
          status: newStatus,
          // The resolved_at timestamp will be handled by the database trigger
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to toggle incident status: ${error.message}`);
    }
  },

  // Create a new incident
  async createIncident(incidentData) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .insert([incidentData])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to create incident: ${error.message}`);
    }
  }
};

// Camera Operations (Supabase integration)
const cameraOperations = {
  // Get all cameras
  async getCameras() {
    try {
      const { data, error } = await supabase
        .from('cameras')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Failed to get cameras: ${error.message}`);
    }
  },

  // Get camera by ID
  async getCameraById(id) {
    try {
      const { data, error } = await supabase
        .from('cameras')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Camera not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get camera: ${error.message}`);
    }
  }
};

// User Operations (Supabase integration for authentication)
const userOperations = {
  // Get user by username
  async getUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  },

  // Get user by ID
  async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('User not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  },

  // Update last login timestamp
  async updateLastLogin(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Failed to update last login: ${error.message}`);
    }
  },

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const { error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }
};

module.exports = {
  incidentOperations,
  cameraOperations,
  userOperations,
  supabase // Export supabase client in case it's needed elsewhere
};