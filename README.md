# CloudMind
## Demo
 http://cloud-mind.net/
 
## Installation
 * Download
 
 ```
 $ git clone https://github.com/6-6/CloudMind.git
 ```
 
 * Installation of dependent packages
 
 ```
 $ cd CloudMind
 $ pip install -r requirements.txt 
 ```
 
 * Configure
 
 ```
 $ cd cloudmind/config
 $ cp default_config.py config.py 
 $ vim config.py 
 $ cd ../../
 ```
 
 * Database initialization
 
 ```
 $ python manage.py db init
 $ python manage.py db migrate
 $ python manage.py db upgrade
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
