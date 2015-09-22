## Usage

### Running app

Install Ruby if not installed and then:

    > gem install jekyll      # install server
    > jekyll serve            # run server

### Linting

    > gem install scss-lint               # install sass linter
    > npm install -g eslint               # install es linter
    > npm install -g eslint-plugin-react  # install react plugin

    > scss-lint _sass                     # run sass linter
    > eslint js                           # run js linter

### Building

    > npm install browserify reactify           # install browserify & reactify

    > browserify -t reactify js/main.js > js/bundle.js        # create a bundle

### Testing
