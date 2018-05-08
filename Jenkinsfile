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
        sh '''npm install --no-save gulp-cli
npm install
gulp'''
      }
    }
  }
}