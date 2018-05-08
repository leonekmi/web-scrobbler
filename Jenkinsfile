pipeline {
  agent any
  stages {
    stage('gulp') {
      agent {
        node {
          label '10.0.0'
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