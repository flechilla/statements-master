import { db } from "../index";
import { clients } from "../schema/clients.table";
import { eq } from "drizzle-orm";
import { Client } from "../types";
async function seedClients() {
  try {
    console.log("Seeding clients started");

    // Define client data
    const clientsData = [
      {
        name: "Adriano",
        email: "adriano@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, Anytown, CA 94105",
      },
      {
        name: "Emma Johnson",
        email: "emma.johnson@example.com",
        phone: "+1 (555) 987-6543",
        address: "456 Oak Avenue, Springfield, NY 10001",
      },
      {
        name: "Michael Chen",
        email: "michael.chen@example.com",
        phone: "+1 (555) 456-7890",
        address: "789 Pine Boulevard, Westfield, TX 75001",
      },
      {
        name: "Sophia Rodriguez",
        email: "sophia.r@example.com",
        phone: "+1 (555) 321-0987",
        address: "321 Cedar Lane, Lakeside, FL 33101",
      },
    ];

    let insertedClients: Client[] = [];

    for (const client of clientsData) {
      // Check if client already exists
      const existingClient = await db
        .select()
        .from(clients)
        .where(eq(clients.email, client.email));

      if (existingClient.length > 0) {
        console.log(`Client ${client.email} already exists, skipping`);
        continue;
      }

      // Insert client
      const [insertedClient] = await db
        .insert(clients)
        .values(client)
        .returning();

      insertedClients.push(insertedClient);
    }

    console.log(`Inserted ${insertedClients.length} clients`);
    console.log("Clients seeding completed");

    return insertedClients;
  } catch (error) {
    console.error("Clients seeding failed:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedClients()
    .then(() => {
      console.log("Clients seeding script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Clients seeding script failed:", error);
      process.exit(1);
    });
}

// Export for use in other seed scripts
export { seedClients };
