#!/bin/bash

# M-Pesa Integration Verification Script
# Checks if all components are properly installed

echo "🔍 Verifying M-Pesa Integration..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $2 (Missing: $1)"
        ((FAILED++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $2 (Missing: $1)"
        ((FAILED++))
        return 1
    fi
}

# Function to check command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅${NC} $2 installed"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $2 not installed"
        ((FAILED++))
        return 1
    fi
}

# Check Node.js and npm
echo "📦 Checking Dependencies..."
check_command node "Node.js"
check_command npm "npm"
echo ""

# Check backend files
echo "🔧 Checking Backend Files..."
check_file "server/mpesa.service.js" "M-Pesa Service"
check_file "server/index.js" "Express Server"
check_file "server/package.json" "Server Package"
check_file "server/.env" "Server Environment Variables"
check_file "server/.env.example" "Server Environment Template"
check_file "server/.gitignore" "Server Gitignore"
echo ""

# Check backend dependencies
if [ -f "server/package.json" ]; then
    echo "📦 Checking Backend Dependencies..."
    cd server
    
    if grep -q "axios" package.json; then
        echo -e "${GREEN}✅${NC} axios dependency listed"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} axios dependency missing"
        ((FAILED++))
    fi
    
    if grep -q "dotenv" package.json; then
        echo -e "${GREEN}✅${NC} dotenv dependency listed"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} dotenv dependency missing"
        ((FAILED++))
    fi
    
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✅${NC} Backend node_modules installed"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC}  Backend dependencies not installed (run: cd server && npm install)"
        ((FAILED++))
    fi
    
    cd ..
    echo ""
fi

# Check frontend files
echo "⚛️  Checking Frontend Files..."
check_file "src/hooks/useMpesa.js" "M-Pesa React Hook"
check_file "src/components/MpesaPayment.jsx" "M-Pesa Payment Component"
check_file "src/components/MpesaPaymentExample.jsx" "M-Pesa Example Component"
check_file "src/pages/MpesaTestPage.jsx" "M-Pesa Test Page"
check_file ".env" "Frontend Environment Variables"
check_file ".env.example" "Frontend Environment Template"
echo ""

# Check documentation
echo "📚 Checking Documentation..."
check_file "MPESA_INDEX.md" "Documentation Index"
check_file "MPESA_QUICKSTART.md" "Quick Start Guide"
check_file "MPESA_INTEGRATION.md" "Integration Guide"
check_file "MPESA_SUMMARY.md" "Summary Document"
check_file "MPESA_FLOW.md" "Flow Diagrams"
check_file "MPESA_TESTING.md" "Testing Guide"
check_file "README_MPESA.md" "M-Pesa README"
check_file "MPESA_FILES_CREATED.md" "Files List"
check_file "MPESA_BANNER.txt" "Banner"
echo ""

# Check utilities
echo "🛠️  Checking Utilities..."
check_file "setup-mpesa.sh" "Setup Script"
check_file "verify-mpesa.sh" "Verification Script"
echo ""

# Check environment variables
echo "🔐 Checking Environment Variables..."
if [ -f "server/.env" ]; then
    if grep -q "MPESA_CONSUMER_KEY" server/.env; then
        echo -e "${GREEN}✅${NC} MPESA_CONSUMER_KEY set"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} MPESA_CONSUMER_KEY missing"
        ((FAILED++))
    fi
    
    if grep -q "MPESA_CONSUMER_SECRET" server/.env; then
        echo -e "${GREEN}✅${NC} MPESA_CONSUMER_SECRET set"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} MPESA_CONSUMER_SECRET missing"
        ((FAILED++))
    fi
    
    if grep -q "MPESA_SHORTCODE" server/.env; then
        echo -e "${GREEN}✅${NC} MPESA_SHORTCODE set"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} MPESA_SHORTCODE missing"
        ((FAILED++))
    fi
fi
echo ""

# Check if ports are available
echo "🌐 Checking Ports..."
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️${NC}  Port 4000 is in use (Backend server might be running)"
else
    echo -e "${GREEN}✅${NC} Port 4000 is available"
    ((PASSED++))
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️${NC}  Port 5173 is in use (Frontend might be running)"
else
    echo -e "${GREEN}✅${NC} Port 5173 is available"
    ((PASSED++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Passed:${NC} $PASSED"
echo -e "${RED}❌ Failed:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! M-Pesa integration is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start backend:  cd server && npm start"
    echo "  2. Start frontend: npm run dev"
    echo "  3. Visit: http://localhost:5173/mpesa-test"
    echo ""
    echo "📖 Read: MPESA_QUICKSTART.md to get started"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some checks failed. Please review the issues above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  • Missing files: Re-run the integration setup"
    echo "  • Missing dependencies: Run ./setup-mpesa.sh"
    echo "  • Environment variables: Check server/.env"
    echo ""
    echo "📖 See: MPESA_TROUBLESHOOTING.md for help"
    exit 1
fi
