const { body, validationResult } = require('express-validator');

/**
 * Validação de propriedade (Grug gosta: usar express-validator instalado!)
 */
const validateProperty = [
    body('title')
        .trim()
        .notEmpty().withMessage('Título é obrigatório')
        .isLength({ min: 3, max: 200 }).withMessage('Título deve ter entre 3 e 200 caracteres'),
    
    body('price')
        .trim()
        .notEmpty().withMessage('Preço é obrigatório')
        .isLength({ min: 1, max: 50 }).withMessage('Preço inválido'),
    
    body('bairro')
        .trim()
        .notEmpty().withMessage('Bairro é obrigatório')
        .isLength({ min: 2, max: 100 }).withMessage('Bairro deve ter entre 2 e 100 caracteres'),
    
    body('tipo')
        .trim()
        .notEmpty().withMessage('Tipo é obrigatório')
        .isIn(['Casa', 'Apartamento', 'Terreno', 'Comercial', 'Rural']).withMessage('Tipo inválido'),
    
    body('quartos')
        .optional({ checkFalsy: true })
        .isInt({ min: 0, max: 50 }).withMessage('Quartos deve ser um número entre 0 e 50'),
    
    body('vagas')
        .optional({ checkFalsy: true })
        .isInt({ min: 0, max: 50 }).withMessage('Vagas deve ser um número entre 0 e 50'),
    
    body('banheiros')
        .optional({ checkFalsy: true })
        .isInt({ min: 0, max: 50 }).withMessage('Banheiros deve ser um número entre 0 e 50'),
    
    body('area_util')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 }).withMessage('Área útil deve ser um número positivo'),
    
    body('area_total')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 }).withMessage('Área total deve ser um número positivo'),
    
    body('cep')
        .optional({ checkFalsy: true })
        .matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido'),
];

/**
 * Middleware para retornar erros de validação
 */
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: 'Dados inválidos',
            details: errors.array()
        });
    }
    next();
}

module.exports = {
    validateProperty,
    handleValidationErrors
};

