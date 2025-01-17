import {createSwaggerSpec} from "@/node_modules/next-swagger-doc";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "app/api", // define api folder under app folder
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Next Swagger API Example",
                version: "1.0",
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            tags: [
                {
                    name: 'Users',
                    description: 'Operations related to users',
                },
                {
                    name: 'Products',
                    description: 'Operations related to products',
                },
                {
                    name: 'Products-type',
                    description: 'Operations related to products-type',
                },
            ], // Группы эндпоинтов
            security: [],
        },
    });
    return spec;
};