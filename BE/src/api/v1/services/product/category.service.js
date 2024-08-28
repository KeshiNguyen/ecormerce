import { BadRequestError } from '../../core/error.response.js'
import { Category } from '../../models/index.model.js'

'use strict'

class CategoryService {
    static createCategory = async ({name, description, parent}) => {
        console.log(`name:: ${name}, description:: ${description}, parent:: ${parent}`)
        const newCategory = await Category.create({
            name,
            description,
            parent
        })
        if(!newCategory) throw new BadRequestError('Cannot create new category::', name)
        return {
            category: newCategory
        }
    }
}

export default CategoryService