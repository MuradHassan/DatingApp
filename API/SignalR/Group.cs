using System.ComponentModel.DataAnnotations;

namespace API.SignalR
{

    public class Group(string name)
    {
        [Key]
        public string Name { get; set; } = name;

        // navigation properties
        public ICollection<Connection> Connections { get; set; } = [];
    }
}