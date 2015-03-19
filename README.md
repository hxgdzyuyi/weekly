# Pagination for [Twitter Bootstrap 3](http://getbootstrap.com/components/#pagination)

With support for:

- erb
- haml
- slim

---

*running in Ubuntu*

* install components
`bundle install`
`npm install`

* produce js files using webpack
`rake assets:webpack`
`rake assets:precompile`

* prepare database
    * install postgresql
    `sudo apt-get install postgresql postgresql-dev-9.3`
    * create new postgres user
    `sudo -u postgres psql`
    ```psql
    create user username with password 'password';
    alter role username superuser createrole createdb replication;
    ```
    * prepare database for rails app
    `rake db:create db:migrate`

* run the app
`rails s`

##Tada! Here we go!
