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
        sh '''npm install
./node_modules/.bin/gulp'''
        archiveArtifacts 'target/*'
      }
    }
  }
}