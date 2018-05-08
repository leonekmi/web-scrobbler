pipeline {
  agent {
    node {
      label 'master'
    }

  }
  stages {
    stage('gulp') {
      agent {
        node {
          label 'master'
        }

      }
      steps {
        sh '''npm install -g gulp-cli
npm install
gulp'''
      }
    }
  }
}