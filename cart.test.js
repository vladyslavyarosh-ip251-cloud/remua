import { describe, test, expect, beforeEach } from 'vitest';

describe('Тестування логіки кошика (localStorage)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Кошик має бути порожнім за замовчуванням', () => {
    const cart = JSON.parse(localStorage.getItem('myOrders')) || [];
    expect(cart).toEqual([]);
    expect(cart.length).toBe(0);
  });

  test('Додавання послуги в кошик', () => {
    let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    
    const mockService = { id: 1, name: 'Ремонт екрану', price: 1500 };
    myOrders.push(mockService);
    
    localStorage.setItem('myOrders', JSON.stringify(myOrders));

    const savedCart = JSON.parse(localStorage.getItem('myOrders'));
    expect(savedCart.length).toBe(1);
    expect(savedCart[0].name).toBe('Ремонт екрану');
    expect(savedCart[0].price).toBe(1500);
  });

  test('Розрахунок загальної суми кошика', () => {
    const cartItems = [
      { id: 1, price: 500 },
      { id: 2, price: 1200 }
    ];

    const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
    expect(total).toBe(1700);
  });
});