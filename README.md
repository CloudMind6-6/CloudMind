# CloudMind
## Demo
 http://cloud-mind.net/
 
## Installation
 1. Download
 
 ```
 $ git clone https://github.com/6-6/CloudMind.git
 ```
 
 1. Installation of dependent packages
 
 ```
 $ cd CloudMind
 $ pip install -r requirements.txt 
 ```
 
 1. Configure
 
 ```
 $ cd cloudmind/config
 $ cp default_config.py config.py 
 $ vim config.py 
 $ cd ../../
 ```
 
 1. Database initialization
 
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

## Upgrade

 ```
 $ git pull
 $ pip install -r requirements.txt 
 $ python manage.py db migrate
 $ python manage.py db upgrade
 ```
