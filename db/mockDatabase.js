const Database = {
  events:[
    {
      id: 1,
      image: "/src/assets/images/coffee.jpg",
      alt: "Photo by Tyler Nix on Unsplash",
      eventTopic: "development",
      eventName: "coding party",
      hostName: "Nancy",
      participants: [],
      eventDate: 'May 21, 2020'
    },
    {
      id: 2,
      image: "/src/assets/images/tea.jpg",
      alt: "Photo by Joanna Kosinska on Unsplash",
      eventTopic: "social",
      eventName: "Coffee Time with Barista",
      hostName: "Nancy",
      participants: [],
      eventDate: "May 10, 2020"
    },
    {
      id: 3,
      image: "/src/assets/images/yoga.jpg",
      alt: "Photo by Avrielle Suleiman on Unsplash",
      eventTopic: "health",
      eventName: "Home Yoga Class",
      hostName: "Ray",
      participants: [],
      eventDate: 'May 13, 2020'
    },
    {
      id: 4,
      image: "/src/assets/images/coffee.jpg",
      alt: "Photo by Tyler Nix on Unsplash",
      eventTopic: "development",
      eventName: "coding party",
      hostName: "Nancy",
      participants: [
        {
          name: "lily",
          email: "lily@gmail.com"
        }
      ],
      eventDate: 'May 21, 2020'
    }
  ],

  users:[
    {
      id: 1,
      name: "lily",
      email: "lily@gmail.com",
      password: "test123",
      interests: ['development', "social", "design"],
      hostedEvents: [
        {
          id: 4,
          eventTopic: "development",
          eventName: "coding party",
          hostName: "lily",
          participants: [],
          eventDate: '2020-05-20T10:00'},
        { 
          id: 2,
          eventTopic: "social",
          eventName: "Coffee Time with Barista",
          hostName: "lily",
          participants: [],
          eventDate: '2020-05-20T22:00'},
      ],
      joinedEvents: []
    },
    {
      id: 2,
      name: "young",
      email: "young@gmail.com",
      password: "test123",
      interests: ['development', "social", "design"],
      hostedEvents: [],
      joinedEvents: []
    },
    {
      id: 3,
      name: "antony",
      email: "antony@gmail.com",
      password: "test123",
      interests: ['development', "social", "design"],
      hostedEvents: [],
      joinedEvents: [
        { 
          id: 2,
          eventTopic: "social",
          eventName: "Coffee Time with Barista",
          hostName: "lily",
          participants: [],
          eventDate: "May 10, 2020"},
      ]
    },
    {
      id: 4,
      name: "james",
      email: "james@gmail.com",
      password: "test123",
      interests: ['development', "social", "design"],
      hostedEvents: [
          {
          id: 1,
          eventTopic: "development",
          eventName: "coding party",
          hostName: "james",
          participants: [],
          eventDate: 'May 21, 2020'
          },
      ],
      joinedEvents: [
        { 
          id: 2,
          eventTopic: "social",
          eventName: "Coffee Time with Barista",
          hostName: "lily",
          participants: [],
          eventDate: "May 10, 2020"},
      ]
    }
  ]
}

module.exports = Database;