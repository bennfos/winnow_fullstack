using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Capstone.Data;
using Capstone.Helpers;
using Capstone.Models.DataModels;
using Capstone.Routes.V1;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Capstone.Controllers.V1
{   
    [ApiController]
    public class QuotesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public QuotesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/quotes
        [HttpGet(Api.Quotes.GetAllUserQuotes)]
        public async Task<ActionResult<List<Quote>>> GetAllUserQuotes([FromQuery] int? pageId, [FromQuery] string search)
        {
            var userId = HttpContext.GetUserId();
            if (pageId != null)
            {
                return await _context.Quotes
               .Where(q => q.PageId == pageId)
               .ToListAsync();
            }

            //if (search != null)
            //{
            //    var quotes = await _context.Quotes
            //        .Include(q => q.Page)
            //        .ThenInclude(p => p.Book)
            //        .Where(q => q.Page.Book.UserId == userId
            //            && q.QuoteAuthor.Contains(search)
            //            || q.QuoteText.Contains(search)
            //            || q.Page.Month.Contains(search)
            //            || q.Page.Thought.Contains(search))
            //        .OrderBy(q => q.Page.Month)
            //        .ThenBy(q => q.Page.Day).ToListAsync();

            //    return quotes;
            //}

           var quotes = await _context.Quotes
                .Include(q => q.Page)
                .ThenInclude(p => p.Book)
                .Where(q => q.Page.Book.UserId == userId)
                .OrderBy(q => q.Page.Month)
                .ThenBy(q => q.Page.Day).ToListAsync();

            return quotes;
        } 

       

        // GET: api/quotes/5
        [HttpGet(Api.Quotes.GetQuote)]
        public async Task<ActionResult<Quote>> GetQuote(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);

            if (quote == null)
            {
                return NotFound();
            }

            return quote;
        }

        // POST: api/books
        [HttpPost(Api.Quotes.PostQuote)]
        public async Task<ActionResult<Quote>> PostQuote(Quote quote)
        {
            Quote newQuote = new Quote
            {
                QuoteText = quote.QuoteText,
                QuoteAuthor = quote.QuoteAuthor,
                CreationDate = DateTime.Now,
                PageId = quote.PageId,              
            };

            _context.Quotes.Add(newQuote);
            await _context.SaveChangesAsync();
          

            return newQuote;
        }

        // PUT: api/books/5
        [HttpPut(Api.Quotes.EditQuote)]
        public async Task<IActionResult> EditQuote(int id, Quote quote)
        {
            if (id != quote.Id)
            {
                return BadRequest();
            }
           
            _context.Entry(quote).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuoteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }


        // DELETE: api/quotes/5
        [HttpDelete(Api.Quotes.DeleteQuote)]
        public async Task<ActionResult<Quote>> DeleteQuote(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);
            if (quote == null)
            {
                return NotFound();
            }

            _context.Quotes.Remove(quote);
            await _context.SaveChangesAsync();

            return quote;
        }

        //Helpter methods
        private bool QuoteExists(int id)
        {
            return _context.Quotes.Any(b => b.Id == id);
        }

    }
}