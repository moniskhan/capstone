Shows = new Mongo.Collection("shows");

if (Meteor.isServer) {
    Shows._ensureIndex({'loc':'2d'}); 
}
