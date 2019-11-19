Vagrant.configure("2") do |config|
    config.vm.box = "chaifeng/ubuntu-18.04-docker-18.06"

    # Create a public network, which generally matched to bridged network.
    # Bridged networks make the machine appear as another physical device on
    # your network.
    config.vm.network "public_network", bridge: "en0: Wi-Fi (Wireless)"
end

# Create a forwarded port mapping which allows access to a specific port
# within the machine from a port on the host machine a
# config.vm.network "forwarded_port", guest: 80, host: 8080

# config.vm.provider "virtualbox" do |vb|
#    # Display the VirtualBox GUI when booting the machine
#    vb.gui = true
#
#    # Customize the amount of memory on the VM:
#    vb.memory = "1024"
# end

# Enable provisioning with a shell script. Additional provisioners such as
# Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
# documentation for more information about their specific syntax and use.
# config.vm.provision "shell", inline: <<-SHELL
#    apt-get update
#    apt-get install -y apache2
# SHELL
# end

