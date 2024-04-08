using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper.Internal.Mappers;
using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; } = string.Empty;
        public DateTimeOffset OrderDate { get; set; }
        public Address ShipToAddress { get; set; } = null!;
        public string DeliveryMethod { get; set; } = null!;
        public decimal ShippingPrice { get; set; }
        public IReadOnlyList<OrderItemDto> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public decimal total { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}