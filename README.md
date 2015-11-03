# CloudMind
## Installation
 * Installation of dependent packages
 
 ```
 $ pip install -r requirements.txt 
 ```
 
 * Configure
 
 ```
 $ cd cloudmind/config
 $ cp default_config.py config.py 
 $ vim config.py 
 ```
 
 * Database initialization
 
 ```
 $ python manage.py db init
 $ python manage.py db migrate
 ```
 
## Usage

 * Debug
 
 ```
 $ python manage.py debug
 ```
 
 * Run
 
 ```
 $ python manage.py run
 ```
