using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Loi",
                    Email = "nguyenloi.itse@gmail.com",
                    UserName = "ngvanloi",
                    Address = new Address
                    {
                        FirstName = "Loi",
                        LastName = "Nguyen",
                        Street = "no.1 169/42 Nguyen Tu Gian",
                        City = "HCM",
                        State = "VN",
                        ZipCode = "7412856",
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}