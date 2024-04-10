using System;
using System.Collections.Generic;

#nullable disable

namespace Contact_Manager_API.Models
{
    public partial class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public bool? Married { get; set; }
        public string Phone { get; set; }
        public decimal? Salary { get; set; }
    }
}
