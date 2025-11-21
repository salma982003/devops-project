pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Setup') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Run Docker') {
            steps {
                sh 'docker build -t my-app:dev .'
                sh 'docker run -d -p 3000:3000 --name smoke-test my-app:dev'
            }
        }
        stage('Smoke Test') {
            steps {
                sh './smoke_test.sh http://localhost:3000'
            }
        }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '**/build/**/*', fingerprint: true
            }
        }
        stage('Cleanup') {
            steps {
                sh 'docker stop smoke-test || true'
                sh 'docker rm smoke-test || true'
            }
        }
    }
}
