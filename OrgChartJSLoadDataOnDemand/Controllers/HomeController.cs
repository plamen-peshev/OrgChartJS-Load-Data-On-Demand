using Microsoft.AspNetCore.Mvc;
using Microsoft.CSharp.RuntimeBinder;
using System.Diagnostics;
using System.Text.Json;
using System.Xml.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace OrgChartJSLoadDataOnDemand.Controllers
{
    public class HomeController : Controller
    {
        private List<dynamic> nodes = new List<dynamic> 
        { 
            new { id = 1 },
            new { id = 2, pid = 1 },
            new { id = 3, pid = 1 },
            new { id = 4, pid = 2 },
            new { id = 5, pid = 2 },
            new { id = 6, pid = 5 },
            new { id = 7, pid = 5 },
            new { id = 8, pid = 6 },
            new { id = 9, pid = 6 },
            new { id = 10, pid = 8 },
            new { id = 11, pid = 9 },
            new { id = 12, pid = 9 },
            new { id = 13, pid = 6 },
            new { id = 14, pid = 13 },
        };

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult FetchNodes(int? id)
        {
            var demandedNodes = new List<dynamic>();
            var nodeIdsWithChildren = new List<int>();
            if (id == null)
            {
                var node = nodes.First();
                demandedNodes.Add(node);
            }
            else 
            {
                foreach (var node in nodes)
                {
                    try
                    {
                        if (node.pid == id)
                        {
                            demandedNodes.Add(node);
                        }
                    }
                    catch (RuntimeBinderException)
                    {
                        //pid doesn't exist
                    }
                }
            }

            foreach (var node in nodes)
            {
                if (HasChildren(node.id))
                {
                    nodeIdsWithChildren.Add(node.id);
                }
            }
 
            return Json(new 
            {
                demandedNodes = demandedNodes,
                nodeIdsWithChildren = nodeIdsWithChildren
            });
        }

        public bool HasChildren(int id)
        {
            foreach (var node in nodes)
            {
                try
                {
                    if (node.pid == id)
                    {
                        return true;
                    }
                }
                catch (RuntimeBinderException)
                {
                    //pid doesn't exist
                }
            }
            return false;
        }
    }
}