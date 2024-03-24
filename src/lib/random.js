// Example usage of Prisma Client to add 50 random products

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addRandomProducts() {
    // Generate and add 50 random products
    for (let i = 51; i < 150; i++) {
        await prisma.product.create({
            data: {
                name: `Product ${i + 1}`,
                description: `Description for Product ${i + 1}`,
                price: generateRandomDecimal(0, 1000),
                tags: generateRandomString(),
            },
        });
    }
}

function generateRandomString() {
    return Math.random().toString(36).substring(2); // Generates a random string
}

function generateRandomDecimal(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2); // Generates a random decimal with 2 decimal places
}

addRandomProducts()
    .catch((error) => {
        console.error('Error adding random products:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
