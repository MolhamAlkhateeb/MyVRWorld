using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MyVRHome.Startup))]
namespace MyVRHome
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
