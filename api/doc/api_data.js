define({ "api": [
  {
    "type": "get",
    "url": "/failLogIn",
    "title": "Request error message when login fails",
    "name": "failLogin",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Login",
            "description": "<p>message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/failSignUp",
    "title": "",
    "name": "failSignup",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Signup",
            "description": "<p>message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Post request with email to change password",
    "name": "forgot_password",
    "group": "Authentication",
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Request to be authenticated to the website",
    "name": "login",
    "group": "Authentication",
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Request from user to logout",
    "name": "logout",
    "group": "Authentication",
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/reset/:token",
    "title": "Request from user to logout",
    "name": "logout",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "res.json",
            "description": "<p>Success message is received</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Request from user to be registered",
    "name": "signup",
    "group": "Authentication",
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/successlogIn",
    "title": "Request success message when login succeeds",
    "name": "successLogin",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Login",
            "description": "<p>message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/sucessSignUp",
    "title": "",
    "name": "sucessSignUp",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Signup",
            "description": "<p>message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/auth.routes.js",
    "groupTitle": "Authentication"
  }
] });
