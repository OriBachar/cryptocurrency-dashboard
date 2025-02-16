import { config } from '../config/env';
import { launchEC2Instance } from '../services/awsService';
import { AppError } from '../types/error';
import { EC2InstanceParams } from '../types/ec2InstanceParams';

export const deployEC2 = async () => {
    try {
        const userData = `#!/bin/bash
            # Update system
            yum update -y
            
            # Install Node.js
            curl -sL https://rpm.nodesource.com/setup_16.x | bash -
            yum install -y nodejs
            
            # Install Git
            yum install -y git
            
            git clone ${config.git.repoUrl}
            cd crypto-dashboard
            
            npm install
            
            npm run build
            
            cat > .env << EOL
            PORT=${config.server.port}
            NODE_ENV=${config.server.env}
            MONGODB_URI=${config.mongodb.uri}
            DB_NAME=${config.mongodb.dbName}
            JWT_SECRET=${config.jwt.secret}
            AWS_ACCESS_KEY_ID=${config.aws.accessKeyId}
            AWS_SECRET_ACCESS_KEY=${config.aws.secretAccessKey}
            AWS_REGION=${config.aws.region}
            AWS_S3_BUCKET=${config.aws.s3Bucket}
            COINGECKO_API_KEY=${config.coinGecko.apiKey}
            GEMINI_API_KEY=${config.gemini.apiKey}
            EOL
            
            # Navigate to dist directory and start the server
            cd dist
            nohup node server.js > ../app.log 2>&1 &`;

        const deploymentParams: EC2InstanceParams = {
            ...config.aws.ec2,
            userData: Buffer.from(userData).toString('base64'),
            tags: [
                {
                    Key: 'Name',
                    Value: 'Crypto-Dashboard-Backend'
                },
                {
                    Key: 'Environment',
                    Value: config.server.env
                }
            ]
        };

        const instanceId = await launchEC2Instance(deploymentParams);
        console.log(`Successfully launched EC2 instance: ${instanceId}`);
        return instanceId;
    } catch (error) {
        throw new AppError('Failed to launch EC2 instance', 500);
    }
};