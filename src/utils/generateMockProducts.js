import { faker } from "@faker-js/faker";

const generateMockProducts = () =>{
    return{
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        descrition: faker.string.alphanumeric({ length: 5, casing: 'upper'}),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        category: faker.commerce.department(),
        tumbnails: faker.image.urlLoremFlickr({
            category: 'technics',
            width: 320,
            height: 240,
        })
    }
}

export default generateMockProducts