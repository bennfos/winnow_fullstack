using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Models.DataModels
{
    public class Quote
    {
        public int Id { get; set; }

       
        [MaxLength(1500)]
        public string QuoteText { get; set; }

        public string QuoteAuthor { get; set; }

     
        public DateTime CreationDate { get; set; }

       
        public int PageId { get; set; }

        public Page Page { get; set; }

    }
}
