import { supabase } from "./supabaseClient";

// ========================================
// LISTINGS SERVICE
// ========================================

export const listingsService = {
  // Get all published listings (public view)
  async getPublicListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*, listing_images(image_url), listing_documents(document_url, document_name)")
      .eq("is_published", true)
      .eq("is_off_market", false)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get all listings for admin
  async getAdminListings(adminId) {
    const { data, error } = await supabase
      .from("listings")
      .select("*, listing_images(image_url), listing_documents(document_url, document_name)")
      .eq("admin_id", adminId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get single listing
  async getListing(id) {
    const { data, error } = await supabase
      .from("listings")
      .select("*, listing_images(image_url), listing_documents(document_url, document_name)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create listing
  async createListing(listing) {
    const { data, error } = await supabase
      .from("listings")
      .insert([listing])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update listing
  async updateListing(id, updates) {
    const { data, error } = await supabase
      .from("listings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete listing
  async deleteListing(id) {
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Upload listing image
  async uploadImage(file, listingId) {
    const fileName = `${listingId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("listing-images")
      .getPublicUrl(fileName);

    // Save to database
    const { error: dbError } = await supabase
      .from("listing_images")
      .insert([{ listing_id: listingId, image_url: data.publicUrl }]);

    if (dbError) throw dbError;
    return data.publicUrl;
  },

  // Upload listing document (PDF)
  async uploadDocument(file, listingId, documentName) {
    const fileName = `${listingId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("listing-documents")
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("listing-documents")
      .getPublicUrl(fileName);

    // Save to database
    const { error: dbError } = await supabase
      .from("listing_documents")
      .insert([{
        listing_id: listingId,
        document_url: data.publicUrl,
        document_name: documentName
      }]);

    if (dbError) throw dbError;
    return data.publicUrl;
  },

  // Delete image
  async deleteImage(imageId, filePath) {
    await supabase.storage.from("listing-images").remove([filePath]);
    await supabase.from("listing_images").delete().eq("id", imageId);
  },

  // Delete document
  async deleteDocument(docId, filePath) {
    await supabase.storage.from("listing-documents").remove([filePath]);
    await supabase.from("listing_documents").delete().eq("id", docId);
  }
};

// ========================================
// ACCESS REQUESTS SERVICE
// ========================================

export const accessRequestsService = {
  // Create access request
  async createAccessRequest(investorId, listingId, message = "") {
    const { data, error } = await supabase
      .from("access_requests")
      .insert([{ investor_id: investorId, listing_id: listingId, message }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get pending requests (for admin)
  async getPendingRequests(adminId) {
    const { data, error } = await supabase
      .from("access_requests")
      .select("*, users(first_name, last_name, email), listings(title, city)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get investor requests
  async getInvestorRequests(investorId) {
    const { data, error } = await supabase
      .from("access_requests")
      .select("*, listings(title, city, cover_image_url)")
      .eq("investor_id", investorId);
    
    if (error) throw error;
    return data || [];
  },

  // Approve request
  async approveRequest(requestId) {
    // Get request details
    const { data: request, error: fetchError } = await supabase
      .from("access_requests")
      .select("investor_id")
      .eq("id", requestId)
      .single();

    if (fetchError) throw fetchError;

    // Grant access
    await supabase
      .from("users")
      .update({ has_off_market_access: true })
      .eq("id", request.investor_id);

    // Update request status
    const { data, error } = await supabase
      .from("access_requests")
      .update({ status: "approved" })
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reject request
  async rejectRequest(requestId) {
    const { data, error } = await supabase
      .from("access_requests")
      .update({ status: "rejected" })
      .eq("id", requestId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ========================================
// CONTACT REQUESTS SERVICE
// ========================================

export const contactRequestsService = {
  async createRequest(formData) {
    const { data, error } = await supabase
      .from("contact_requests")
      .insert([formData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRequests() {
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// ========================================
// PARTNERSHIP REQUESTS SERVICE
// ========================================

export const partnershipRequestsService = {
  async createRequest(formData) {
    const { data, error } = await supabase
      .from("partnership_requests")
      .insert([formData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRequests() {
    const { data, error } = await supabase
      .from("partnership_requests")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// ========================================
// LAND SUBMISSIONS SERVICE
// ========================================

export const landSubmissionsService = {
  async createSubmission(formData) {
    const { data, error } = await supabase
      .from("land_submissions")
      .insert([formData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSubmissions(ownerId = null) {
    let query = supabase.from("land_submissions").select("*");
    
    if (ownerId) {
      query = query.eq("owner_id", ownerId);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateStatus(submissionId, status) {
    const { data, error } = await supabase
      .from("land_submissions")
      .update({ status })
      .eq("id", submissionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ========================================
// USERS SERVICE
// ========================================

export const usersService = {
  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all users (admin only)
  async getAllUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Make user admin
  async makeAdmin(userId) {
    const { data, error } = await supabase
      .from("users")
      .update({ is_admin: true })
      .eq("id", userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Remove admin
  async removeAdmin(userId) {
    const { data, error } = await supabase
      .from("users")
      .update({ is_admin: false })
      .eq("id", userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ========================================
// AUTH SERVICE
// ========================================

export const authService = {
  // Sign up
  async signUp(email, password, metadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset password
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  // Get session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Listen to auth changes
  onAuthStateChanged(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};
