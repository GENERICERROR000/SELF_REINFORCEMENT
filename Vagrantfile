Vagrant.configure("2") do |config|
    config.vm.box = "chaifeng/ubuntu-18.04-docker-18.06"
    config.vm.network "public_network", bridge: "en0: Wi-Fi (Wireless)"
	
	config.vm.provider "virtualbox" do |vb|
		vb.memory = "1024"
	end
end

# TODO: Set custom ips on net for vm's - that way i always KNOW
# TODO: Should this join cluster?
# TODO: All ports for VM's can be the same becuase no mapping between hosts and ports

# Enable provisioning with a shell script. Additional provisioners such as
# Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
# documentation for more information about their specific syntax and use.
# config.vm.provision "shell", inline: <<-SHELL
#    apt-get update
#    apt-get install -y apache2
# SHELL
# end

