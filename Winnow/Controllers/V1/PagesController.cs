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
    public class PagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PagesController(ApplicationDbContext context)
        {
            _context = context;
        }
       
        // GET: api/pages/5
        [HttpGet(Api.Pages.GetPage)]
        public async Task<ActionResult<Page>> GetPage(int id)
        {
            var page = await _context.Pages.FindAsync(id);

            if (page == null)
            {
                return NotFound();
            }

            return page;
        }

        // POST: api/pages
        [HttpPost(Api.Pages.PostPage)]
        public async Task<ActionResult<Page>> PostPage(Page page)
        {
            Page newPage = new Page
            {
                Month = page.Month,
                Day = page.Day,
                Thought = page.Thought,
                BookId = page.BookId
            };

            _context.Pages.Add(newPage);
            await _context.SaveChangesAsync();

            var foundPage = _context.Pages.Where(p => p.BookId == newPage.BookId).OrderByDescending(p => p.Id).Take(1);

            return newPage;
        }

        // PUT: api/pages/5
        [HttpPut(Api.Pages.EditPage)]
        public async Task<IActionResult> EditPage(int id, Page page)
        {
            if (id != page.Id)
            {
                return BadRequest();
            }
         
            _context.Entry(page).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PageExists(id))
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

        [HttpGet(Api.Pages.CheckForPage)]
        public async Task<ActionResult<Page>> CheckForPage([FromQuery] int bookId, [FromQuery] string month, [FromQuery] string day) 
        {
            var page = await _context.Pages.Where(p => p.BookId == bookId && p.Month == month && p.Day == day).FirstOrDefaultAsync();

            if (page == null)
            {
                var emptyPage = new Page()
                {
                    Id = 0,
                    Month = null,
                    Day = null,
                    BookId = 0
                };
                return emptyPage;       
            }

            return page;
        }

        //Helpter methods
        private bool PageExists(int id)
        {
            return _context.Pages.Any(p => p.Id == id);
        }
    }
}