pipeline {
    agent { label 'insightblue-6' }

    options {
        buildDiscarder logRotator(
            numToKeepStr: '10'
        )
    }
    environment {
        REPO_NAME = "asaiasa"
        GITLAB_REP = "registry.gitlab.com/asaiasa/${REPO_NAME}"
        PROJECT_PATH="/home/jenkins/workspace/asaiasa"
        SCRIPTS_K8S_PATH="${PROJECT_PATH}/deployment/k8s"
        TEST_BY = 'jenkins'
        GIT_BRANCH = "${env.GIT_BRANCH.replace('origin/', '')}"
        IMAGE_TAG = "${currentBuild.number}-${env.GIT_BRANCH.replace('origin/', '').replace('/', '-')}"
        DISCORD_WEBHOOK="https://discord.com/api/webhooks/1222242944384368782/VtgsxpyBMk-nQrlZhmyU0K8N4Xt6b3T1Cs5oYHYamJZrD2tYtBDmw75_0hpA6Ft3jJ0m"
        REPORT_LINK="https://jenkins.insightblue.co/job/asaiasa/${env.BUILD_NUMBER}/Test_20Reports/"
    }
    stages {
        stage('Cloning Git') {
            steps {
                script {
                    sh "git checkout ${env.GIT_BRANCH}"
                    sh "git reset --hard origin/${env.GIT_BRANCH}"
                }
            }
        }

        stage('Building image') {
            steps{
                script {
                    withCredentials([usernamePassword(credentialsId: 'khum38-gitlab', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "docker login -u gitlab+deploy-token -p ${PASSWORD} registry.gitlab.com"
                        sh "docker build --build-arg GITHUB_TOKEN=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 --no-cache -f backend/Dockerfile -t ${GITLAB_REP}:${IMAGE_TAG} ./backend"
                    }
                }
            }
        }

        // stage('Test Backend') {
        //     steps{
        //         script {
        //             dir('backend') {
        //                 sh "go test -v ./..."
        //             }
        //         }
        //     }
        // }

        stage('Push image') {
            steps{
                script {
                    withCredentials([usernamePassword(credentialsId: 'khum38-gitlab', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "docker push ${GITLAB_REP}:${IMAGE_TAG}"
                    }
                }
            }
        }
        // stage('Deploy - Development') {
        //     when {
        //         expression {
        //             env.GIT_BRANCH == 'develop'
        //         }
        //     }
        //     steps {
        //         dir(SCRIPTS_K8S_PATH){
        //             script {
        //                 sh "./deploy.sh dev ${IMAGE_TAG}"
        //             }
        //         }
        //     }
        // }

        stage('Deploy - Production') {
            when {
                expression {
                    env.GIT_BRANCH == 'main'
                }
            }
            steps {
                dir(SCRIPTS_K8S_PATH){
                    script {
                        sh "./deploy.sh prod ${IMAGE_TAG}"
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                discordSend(
                    webhookUrl: "${DISCORD_WEBHOOK}",
                    message: "ASAiASA pipeline successful! :tada:",
                    color: 2276147,
                    successful: true,
                    link: "${env.BUILD_URL}",
                    e2eLink: "${REPORT_LINK}",
                    buildNo: "${env.BUILD_NUMBER}"
                )
            }
        }
        failure {
            script {
                discordSend(
                    webhookUrl: "${DISCORD_WEBHOOK}",
                    message: "ASAiASA pipeline failed! :x:",
                    color: 12263716,
                    successful: false,
                    link: "${env.BUILD_URL}",
                    e2eLink: "${REPORT_LINK}",
                    buildNo: "${env.BUILD_NUMBER}"
                )
            }
        }
    }
}

def discordSend(Map params) {
    def payload = "{ \"username\": \"Jenkins\",\"embeds\": [{\"title\": \"${params.message}\",\"url\": \"${params.link}\",\"color\": ${params.color},\"description\":\" E2E report => [Report](${params.e2eLink}) \",\"fields\": [{\"name\": \"Build No\",\"value\": \"${params.buildNo}\"}]}]}"
    sh "curl -X POST -H 'Content-Type: application/json' -d '${payload}' ${params.webhookUrl}"
}

