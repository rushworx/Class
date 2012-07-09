Description
===========

Demo application for the PeepCode video on Full Stack Node.js (https://peepcode.com/products/full-stack-nodejs).

Usage
=====

Install dependencies:

    npm install

Redis is also required:

    brew install redis

Run the server:

    npm start

Visit the admin page. Add some pies. User is `piechef`, password `12345`:

    http://localhost:3000/admin
    http://localhost:3000/admin/pies

Change the status of some pies to 'oven' or 'ready':

    http://localhost:3000/admin/menu/stage

View the pies on the main page. They will update immediately when you change them on the admin page.

    http://localhost:3000/


Optional
========

Run tests:

    npm test

Run development server:

    ./bin/devserver


