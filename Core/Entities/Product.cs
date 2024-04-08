using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? PictureUrl { get; set; }
        public ProductType ProductType { get; set; } = null!;
        public int ProductTypeId { get; set; }
        public ProductBrand ProductBrand { get; set; } = null!;
        public int ProductBrandId { get; set; }
    }
}