# Rate My Pint 

Pre-deployment build of RateMyPint which is developed using React and Django. The web-app gives users the ability to rate the quality of pints in pubs and bars across the UK, allowing people to find great pints in different cities they visit.

## General info
Rate My Pint uses the Google Maps API that will show a map of all the best pints in their current location if the user allows location services. If the user denies giving their location or wishes to see a different place, they can use the search at the top of the page. This search function also uses Google Maps Places API to auto-complete a location, this API is also used when searching for a venue when adding a new pint entry. 

Users can also see the top-rated pints that all users have submitted based on the average rating of a given pint in a venue. Also present is the ability to see the most popular cities/locations that users have submitted, along with the best-rated venues that serve the most consistently good pints. 

The app is fully optimised for mobile and all other screen sizes, users can also submit Bug Reports and feedback using the link in the footer. 

This code is a pre-deployment build of Rate My Pint. The production version uses PostgreSQL as its database which is hosted on AWS RDS. Both the backend and frontend are hosted on Heroku. 

www.Ratemypint.co.uk

Build with Django REST Framework, React,  Material-UI, Google Maps API, Google Places API, Heroku, AWS, PostgreSQL

## Home
![](/sampleimages/home.jpeg?raw=true "Home")

