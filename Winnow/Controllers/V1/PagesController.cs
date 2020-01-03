using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Capstone.Data;
using Capstone.Routes.V1;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Capstone.Controllers.V1
{
  
    [ApiController]
    public class PagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PagesController(ApplicationDbContext context)
        {
            _context = context;
        }
       
        // GET: api/pages/5
        [HttpGet(Api.Pages.GetPage)]
        public async Task<ActionResult<Page>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // POST: api/books
        [HttpPost(Api.Books.PostBook)]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            Book newBook = new Book
            {
                Title = book.Title,
                Description = book.Description,
                CreationDate = DateTime.Now,
                StartsBlank = true,
                UserId = HttpContext.GetUserId()
            };

            _context.Books.Add(newBook);
            await _context.SaveChangesAsync();

            var foundBook = _context.Books.Where(b => b.UserId == newBook.UserId).OrderByDescending(b => b.Id).Take(1);

            return Ok(foundBook);
        }

        // PUT: api/books/5
        [HttpPut(Api.Books.EditBook)]
        public async Task<IActionResult> EditBook(int id, Book book)
        {
            if (id != book.Id)
            {
                return BadRequest();
            }

            var userId = HttpContext.GetUserId();
            book.UserId = userId;
            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
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


        // DELETE: api/books/5
        [HttpDelete(Api.Books.DeleteBook)]
        public async Task<ActionResult<Book>> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return book;
        }

        //Helpter methods
        private bool BookExists(int id)
        {
            return _context.Books.Any(b => b.Id == id);
        }
    }
}