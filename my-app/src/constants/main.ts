
// Pagination
export const PAGINATION_CONFIG = {
    ITEMS_PER_PAGE: 10,
    DEFAULT_PAGE: 1,
} as const;


export const PAYMENT_METHOD = [
    {id:'all',name:'All'},
    {id:'coin',name:'Coin'}, 
    // {id:'point',name:'Point'}, 
    {id:'prompt_pay',name:'Prompt Pay'}, 
    // {id:'member_card',name:'Member Card'}, 
    {id:'force',name:'Force'}
] as const;