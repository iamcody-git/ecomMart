import { Inngest } from "inngest";
import connectDB from "./dbConfig";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to save user data in the database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();

      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const name = [first_name, last_name].filter(Boolean).join(" ");

      await User.create({
        _id: id,
        email: email_addresses?.[0]?.email_address || "",
        name,
        imageUrl: image_url,
      });

      console.log(`User ${id} created successfully`);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }
);

// Inngest function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      await connectDB();

      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const name = [first_name, last_name].filter(Boolean).join(" ");

      await User.findByIdAndUpdate(id, {
        email: email_addresses?.[0]?.email_address || "",
        name,
        imageUrl: image_url,
      });

      console.log(`User ${id} updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
);

// Inngest function to delete user from the database
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" }, // Fixed event name
  async ({ event }) => {
    try {
      await connectDB();

      const { id } = event.data;
      await User.findByIdAndDelete(id);

      console.log(`User ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
);
