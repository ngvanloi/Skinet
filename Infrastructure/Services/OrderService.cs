using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IGenericRepository<Order> _orderRepo;
        private readonly IGenericRepository<DeliveryMethod> _deliveryRepo;
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IBasketRepository _basketRepo;
        public OrderService(
            IGenericRepository<Order> orderRepo,
            IGenericRepository<DeliveryMethod> deliveryRepo,
            IGenericRepository<Product> productRepo,
            IBasketRepository basketRepo)
        {
            _productRepo = productRepo;
            _deliveryRepo = deliveryRepo;
            _orderRepo = orderRepo;
            _basketRepo = basketRepo;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            var basket = await _basketRepo.GetBasketAsync(basketId);

            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productOrder = await _productRepo.GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productOrder.Id, productOrder.Name, productOrder.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productOrder.Price, item.Quantity);
                items.Add(orderItem);
            }

            var delivery = await _deliveryRepo.GetByIdAsync(deliveryMethodId);

            var subtotal = items.Sum(item => item.Price * item.Quantity);

            var order = new Order(items, buyerEmail, shippingAddress, delivery, subtotal);  

            return order;
        }

        public Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            throw new NotImplementedException();
        }
    }
}