const ItemIlegal = require('../database/itemlegal');

class DatabaseManager {
    static async saveItemIlegal(itemData, maxRetries = 3) {
        let retryCount = 0;
        let lastError = null;

        while (retryCount < maxRetries) {
            try {
                const newItem = new ItemIlegal(itemData);
                const savedItem = await newItem.save();
                console.log(`✅ Item salvo com sucesso: ${savedItem._id}`);
                return savedItem;
            } catch (error) {
                lastError = error;
                retryCount++;
                console.error(`❌ Tentativa ${retryCount} falhou:`, error);
                
                if (error.code === 11000) {
                    throw new Error('Item já catalogado recentemente.');
                }
                
                if (retryCount === maxRetries) {
                    break;
                }
                
                // Espera exponencial entre tentativas
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            }
        }

        throw new Error(`Falha ao salvar após ${maxRetries} tentativas. Último erro: ${lastError.message}`);
    }

    static async saveMultipleItems(itemsData) {
        try {
            const savedItems = await Promise.all(
                itemsData.map(data => this.saveItemIlegal(data))
            );
            return savedItems;
        } catch (error) {
            console.error('❌ Erro ao salvar múltiplos itens:', error);
            throw error;
        }
    }

    static async findItemsByUser(userId) {
        try {
            return await ItemIlegal.find({ userId }).sort({ timestamp: -1 });
        } catch (error) {
            console.error('❌ Erro ao buscar itens do usuário:', error);
            throw error;
        }
    }

    static async findRecentItems(limit = 10) {
        try {
            return await ItemIlegal.find()
                .sort({ timestamp: -1 })
                .limit(limit);
        } catch (error) {
            console.error('❌ Erro ao buscar itens recentes:', error);
            throw error;
        }
    }

    static async deleteItem(itemId) {
        try {
            const result = await ItemIlegal.findByIdAndDelete(itemId);
            if (!result) {
                throw new Error('Item não encontrado');
            }
            return result;
        } catch (error) {
            console.error('❌ Erro ao deletar item:', error);
            throw error;
        }
    }

    static async updateItem(itemId, updateData) {
        try {
            const updatedItem = await ItemIlegal.findByIdAndUpdate(
                itemId,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedItem) {
                throw new Error('Item não encontrado');
            }
            return updatedItem;
        } catch (error) {
            console.error('❌ Erro ao atualizar item:', error);
            throw error;
        }
    }

    static async countItemsByType(userId) {
        try {
            return await ItemIlegal.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: '$tipo',
                        total: { $sum: '$quantidade' }
                    }
                }
            ]);
        } catch (error) {
            console.error('❌ Erro ao contar itens por tipo:', error);
            throw error;
        }
    }
}

module.exports = DatabaseManager; 