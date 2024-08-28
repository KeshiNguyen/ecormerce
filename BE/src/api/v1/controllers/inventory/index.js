'use strict'

import InventoryService from '../../services/inventory/index.js';

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Caart add to inventory successfully completed',
            metadata: await InventoryService.addStockToInventory(req.body)
        })
    }
}

export default new InventoryController()