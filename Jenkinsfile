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
                bat 'npm ci'
            }
        }
        stage('Generate Prisma') {
            steps {
                bat 'npx prisma generate'
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        stage('Run Docker') {
            steps {
                bat 'docker build -t my-app:dev .'
                bat 'docker run -d -p 3000:3000 --name smoke-test my-app:dev'
            }
        }
        stage('Smoke Test') {
            steps {
                bat 'call smoke_test.bat http://localhost:3000'
            }
        }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '**/.next/**/*', fingerprint: true
            }
        }
        stage('Cleanup') {
            steps {
                bat 'docker stop smoke-test || true'
                bat 'docker rm smoke-test || true'
            }
        }
    }
}
