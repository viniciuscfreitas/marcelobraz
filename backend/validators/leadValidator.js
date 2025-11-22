const { body, validationResult } = require('express-validator');

/**
 * Validação de lead (Grug gosta: simples mas eficaz!)
 */
const validateLead = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Telefone é obrigatório')
        .matches(/^[\d\s\(\)\-\+]+$/).withMessage('Telefone inválido')
        .isLength({ min: 10, max: 20 }).withMessage('Telefone deve ter entre 10 e 20 caracteres'),
    
    body('property_id')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 }).withMessage('ID da propriedade inválido'),
    
    body('type')
        .optional()
        .isIn(['gate', 'contact', 'whatsapp']).withMessage('Tipo inválido'),
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
    validateLead,
    handleValidationErrors
};


