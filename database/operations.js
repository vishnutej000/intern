const supabase = require('./supabase');

// Incident operations
const incidentOperations = {
  // Get all incidents with optional resolved filter
  async getIncidents(resolvedFilter = null) {
    let query = supabase
      .from('incidents')
      .select(`
        *,
        cameras:camera_id (
          id,
          name,
          location
        )
      `)
      .order('ts_start', { ascending: false });

    if (resolvedFilter !== null) {
      query = query.eq('resolved', resolvedFilter);
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching incidents: ${error.message}`);
    }

    // Transform data to match expected format
    return data.map(incident => ({
      ...incident,
      cameraName: incident.cameras?.name,
      cameraLocation: incident.cameras?.location,
      thumbnailUrl: incident.thumbnail_url || `/api/placeholder-thumbnail/${incident.id}`
    }));
  },

  // Get single incident by ID
  async getIncidentById(id) {
    const { data, error } = await supabase
      .from('incidents')
      .select(`
        *,
        cameras:camera_id (
          id,
          name,
          location
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching incident: ${error.message}`);
    }

    return {
      ...data,
      cameraName: data.cameras?.name,
      cameraLocation: data.cameras?.location,
      thumbnailUrl: data.thumbnail_url || `/api/placeholder-thumbnail/${data.id}`
    };
  },

  // Toggle incident resolved status
  async toggleIncidentResolved(id) {
    // First get current incident
    const incident = await this.getIncidentById(id);
    
    // Toggle resolved status
    const newResolvedStatus = !incident.resolved;
    
    const { data, error } = await supabase
      .from('incidents')
      .update({ 
        resolved: newResolvedStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        cameras:camera_id (
          id,
          name,
          location
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error updating incident: ${error.message}`);
    }

    return {
      ...data,
      cameraName: data.cameras?.name,
      cameraLocation: data.cameras?.location,
      thumbnailUrl: data.thumbnail_url || `/api/placeholder-thumbnail/${data.id}`
    };
  }
};

// Camera operations
const cameraOperations = {
  // Get all cameras
  async getCameras() {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .order('id');

    if (error) {
      throw new Error(`Error fetching cameras: ${error.message}`);
    }

    return data;
  },

  // Get camera by ID
  async getCameraById(id) {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching camera: ${error.message}`);
    }

    return data;
  }
};

// User operations
const userOperations = {
  // Get user by username
  async getUserByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  },

  // Get user by ID
  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, avatar_url, last_login')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  },

  // Update user last login
  async updateLastLogin(id) {
    const { error } = await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }
  },

  // Update user profile
  async updateUserProfile(id, { email, avatar_url }) {
    const { error } = await supabase
      .from('users')
      .update({ 
        email,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }
  }
};

module.exports = {
  incidentOperations,
  cameraOperations,
  userOperations
};